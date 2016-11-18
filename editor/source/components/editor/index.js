import React from 'react'
import Component from '../index'
import classNames from 'classnames'
import ace from 'brace'
import 'brace/mode/markdown'
import 'brace/mode/yaml'
import 'brace/theme/tomorrow'
import _ from 'lodash'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import * as util from '../util'
import * as editorAction from './action'
import * as listAction from '../list/action'
import * as menuAction from '../menu/action'

import Header from '../header'

class Editor extends Component {
    constructor(props) {
        super(props)
        this.state = {
            configMode: false,
            toolbar: {
                show: false,
                selectMode: false
            }
        }
    }
    switchConfigMode() {
        if (this.notArticle()) {
            this.props.util.showTip('auto', '提示：保存修改后请重启纸小墨以更新')
        } else {
            this.setState({configMode: !this.state.configMode})
            if (this.state.configMode) {
                this.contentEditor.focus()
                this.props.util.showTip('auto', '切换至内容')
            } else {
                this.configEditor.focus()
                this.props.util.showTip('auto', '切换至配置')
            }
            this.setEditorStyle(this.contentEditor)
            this.setEditorStyle(this.configEditor)
            this.changeToolbar()
        }
    }
    resizeEditor() {
        const width = window.innerWidth ||
            document.documentElement.clientWidth ||
            document.body.clientWidth
        if (width > 800) {
            this.contentEditor.renderer.setPadding((width - 800) / 2)
            this.configEditor.renderer.setPadding((width - 800) / 2)
        }
        this.setEditorStyle(this.contentEditor)
        this.setEditorStyle(this.configEditor)
        this.changeToolbar()
    }
    getStorageItem(id) {
        let editData = null
        const editStr = localStorage.getItem('edit')
        try {
            editData = JSON.parse(editStr)
        } catch(err) {}
        if (editData) {
            return editData[id] || null
        }
        return null
    }
    setStorageItem(id, data) {
        let editData = null
        const editStr = localStorage.getItem('edit')
        try {
            editData = JSON.parse(editStr)
        } catch(err) {}
        if (!editData) editData = {}
        editData[id] = data
        localStorage.setItem('edit', JSON.stringify(editData))
    }
    removeStorageItem(id) {
        let editData = null
        const editStr = localStorage.getItem('edit')
        try {
            editData = JSON.parse(editStr)
        } catch(err) {}
        if (editData && editData[id]) {
            delete editData[id]
        }
        localStorage.setItem('edit', JSON.stringify(editData))
    }
    componentDidUpdate(prevProps, prevState) {
        const openId = this.props.params.id
        if (this.props.editor.get('id') != openId) {
            switch(openId) {
                case 'config':
                    this.props.menuAction.openConfig()
                    break
                case 'help':
                    this.props.menuAction.openHelp()
                    break
                default:
                    this.props.listAction.openArticle(openId)
                    break
            }
        } else {
            switch(openId) {
                case 'config':
                    this.contentEditor.session.setMode('ace/mode/yaml')
                    break
                case 'help':
                    this.contentEditor.session.setMode('ace/mode/markdown')
                    break
                default:
                    this.contentEditor.session.setMode('ace/mode/markdown')
                    this.configEditor.session.setMode('ace/mode/yaml')
                    break
            }
        }
        const currentId = this.props.editor.get('id')
        if (!prevProps || currentId != prevProps.editor.get('id')) {
            const editData = this.getStorageItem(currentId)
            if (editData && editData.id) {
                if (currentId == editData.id) {
                    this.props.util.showTip('auto', '已恢复未保存编辑', {
                        button: '撤销',
                        callback: () => {
                            this.contentEditor.setValue(this.props.editor.get('content') || '', -1)
                            this.configEditor.setValue(this.props.editor.get('config') || '', -1)
                            this.setState({configMode: false})
                            this.removeStorageItem(currentId)
                            this.props.util.showTip('auto', '已还原编辑前内容')
                        }
                    })
                    this.contentEditor.session.setValue(editData.content || '', -1)
                    this.configEditor.session.setValue(editData.config || '', -1)
                    this.setState({configMode: false})
                    return
                }
            }
            this.contentEditor.session.setValue(this.props.editor.get('content') || '', -1)
            this.configEditor.session.setValue(this.props.editor.get('config') || '', -1)
            this.setState({configMode: false})
        }
    }
    setEditorStyle(editor) {
        const editorOption = {
            scrollPastEnd: true,
            showGutter: false,
            wrap: true,
            theme: 'ace/theme/tomorrow',
            // mode: 'ace/mode/markdown',
            showPrintMargin: false,
            fontSize: '16px',
            fontFamily: "Menlo, Consolas, 'source-code-pro', 'DejaVu Sans Mono', Monaco, 'Ubuntu Mono', 'Courier New', Courier, 'Microsoft Yahei', 'Hiragino Sans GB', 'WenQuanYi Micro Hei', monospace",
            hScrollBarAlwaysVisible: false,
            selectionStyle: "line",
            displayIndentGuides: false,
            animatedScroll: true
        }
        // editor.setKeyboardHandler('ace/keyboard/vim')
        editor.setOptions(editorOption)
        editor.renderer.setScrollMargin(200, 200)
        editor.container.style.lineHeight = 1.7
        editor.$blockScrolling = Infinity
        editor.on('focus', () =>
            this.props.listAction.hide()
        )
    }
    cumulativeOffset(element) {
        let top = 0, left = 0
        do {
            top += element.offsetTop  || 0
            left += element.offsetLeft || 0
            element = element.offsetParent
        } while(element)
        return {
            top,
            left
        }
    }
    mergeState(object) {
        this.setState(Object.assign({}, this.state, object))
    }
    notArticle() {
        const openId = this.props.params.id
        if (!['config', 'help'].includes(openId)) {
            return null
        }
        return openId
    }
    focusLine() {
      const selectRange = this.contentEditor.getSelectionRange()
      const firstShowRow = this.contentEditor.getFirstVisibleRow()
      const startRow = selectRange.start.row - firstShowRow
      const endRow = selectRange.end.row - firstShowRow;
      // const scrollTop = this.contentEditor.getCursorPositionScreen().row * 25;
      // this.contentEditor.session.setScrollTop(scrollTop - 400);
      const lines = document.querySelectorAll('#content-editor .ace_line_group');
      ([]).forEach.call(lines, (line, idx) => {
          if (idx >= startRow && idx <= endRow) {
          // if (idx == endRow) {
              line.className = 'ace_line_group no-blur'
          } else {
              line.className = 'ace_line_group'
          }
      })
    }
    showToolbar() {
      const contentSelection = this.contentEditor.getSelection()
      const contentSession = this.contentEditor.getSession()
      const toolbarElem = document.querySelector('#editor-toolbar')
      const cursor = contentSelection.getCursor()
      const selectedText = contentSession.doc.getTextRange(contentSelection.getRange())
      const cursorElem = document.querySelector('#content-editor .ace_cursor')
      const cursorPos = this.cumulativeOffset(cursorElem)
      if (_.trim(selectedText) && !selectedText.includes('\n')) {
          toolbarElem.style.top = cursorPos.top - 45 + 'px'
          toolbarElem.style.left = cursorPos.left - 15 + 'px'
          this.mergeState({
              toolbar: {show: true, selectMode: true}
          })
          return
      } else {
          toolbarElem.style.top = cursorPos.top - 5 + 'px'
          toolbarElem.style.left = cursorPos.left - 55 + 'px'
          this.mergeState({
              toolbar: {selectMode: false}
          })
      }
      const line = contentSession.getLine(cursor.row)
      if (cursor.column == 0 && line.length == 0) {
          this.mergeState({
              toolbar: {show: true}
          })
      } else {
          this.mergeState({
              toolbar: {show: false}
          })
      }
    }
    changeToolbar() {
        this.focusLine()
        _.delay(this.showToolbar.bind(this), 100)
    }
    componentDidMount() {
        // init content editor
        this.contentEditor = ace.edit('content-editor')
        window.editor = this.contentEditor
        this.setEditorStyle(this.contentEditor)
        // init config editor
        this.configEditor = ace.edit('config-editor')
        this.setEditorStyle(this.configEditor)
        this.configEditor.on('input', () => {
            if (!this.notArticle()) {
                this.props.editorAction.setHeader(this.configEditor.getValue())
            }
            this.onEditorChange()
        })
        this.contentEditor.on('input', () => {
            this.onEditorChange()
        })
        this.contentEditor.on('focus', () => {
            this.focusLine()
        })
        this.contentEditor.session.on('changeScrollTop', () => {
            const currentScrollTop = this.contentEditor.session.getScrollTop()
            const headerElem = document.querySelector('#header')
            if (currentScrollTop <= -100) {
                const opacity = 1 - (currentScrollTop + 200) / 100
                headerElem.style.opacity = opacity
                headerElem.style.display = 'flex'
            } else {
                headerElem.style.opacity = 0
                headerElem.style.display = 'none'
            }
            this.changeToolbar()
        })
        const contentSelection = this.contentEditor.getSelection()
        contentSelection.on('changeCursor', this.changeToolbar.bind(this))
        // resize by window size
        this.resizeEditor()
        window.addEventListener('resize', this.resizeEditor.bind(this))
        this.componentDidUpdate()
    }
    onEditorChange() {
        let origin = ''
        let current = ''
        const originConfig = _.trim(this.props.editor.get('config'))
        const originContent = _.trim(this.props.editor.get('content'))
        const currentConfig = _.trim(this.configEditor.getValue())
        const currentContent = _.trim(this.contentEditor.getValue())
        if (this.notArticle()) {
            current = _.trim(this.contentEditor.getValue())
            origin = _.trim(originContent)
        } else {
            current = `${currentConfig}\n\n---\n\n${currentContent}`
            origin = `${originConfig}\n\n---\n\n${originContent}`
        }
        this.props.editorAction.setCurrent(current)
        const currentId = this.props.editor.get('id')
        if (origin != current) {
            this.setStorageItem(currentId, {
              id: currentId,
              config: currentConfig,
              content: currentContent
            })
        }
        this.changeToolbar()
    }
    moveContentEditorCursor(row, column) {
        const contentSelection = this.contentEditor.getSelection()
        const cursor = contentSelection.getCursor()
        contentSelection.moveTo(cursor.row + row, cursor.column + column)
        _.delay(() => {
            this.mergeState({
                toolbar: {show: false}
            })
        }, 200)
        this.contentEditor.focus()
    }
    focusEditor() {
        if (this.state.configMode) {
            this.contentEditor.focus()
            alert(1)
        } else {
            this.configEditor.focus()
        }
    }
    onFileSelect(event) {
        this.props.editorAction.uploadImage(event.currentTarget.files[0], (path) => {
            this.contentEditor.insert(`![](${path})`)
            this.moveContentEditorCursor(0, 0)
        })
        event.currentTarget.value = ''
    }
    onActionClick(event) {
        const type = event.currentTarget.getAttribute('type')
        const contentSelection = this.contentEditor.getSelection()
        const contentSession = this.contentEditor.getSession()
        const selectedText = this.contentEditor.getSelectedText()
        switch(type) {
            case 'code':
                this.contentEditor.insert('``` \n```')
                this.moveContentEditorCursor(-1, 1)
                return
            case 'ol':
                this.contentEditor.insert('1. ')
                this.moveContentEditorCursor(0, 0)
                return
            case 'ul':
                this.contentEditor.insert('- ')
                this.moveContentEditorCursor(0, 0)
                return
            case 'indent':
                this.contentEditor.insert('> ')
                this.moveContentEditorCursor(0, 0)
                return
            case 'line':
                this.contentEditor.insert('----------\n')
                this.moveContentEditorCursor(0, 0)
                return
            case 'bold':
                {
                    this.contentEditor.insert(`**${selectedText}**`)
                    this.moveContentEditorCursor(0, -(selectedText.length + 2))
                    const cursor = contentSelection.getCursor()
                    contentSelection.selectTo(cursor.row, cursor.column + selectedText.length)
                    return
                }
            case 'italic':
                {
                    this.contentEditor.insert(`*${selectedText}*`)
                    this.moveContentEditorCursor(0, -(selectedText.length + 1))
                    const cursor = contentSelection.getCursor()
                    contentSelection.selectTo(cursor.row, cursor.column + selectedText.length)
                    return
                }
            case 'link':
                {
                    this.contentEditor.insert(`[${selectedText}]()`)
                    this.moveContentEditorCursor(0, -1)
                    return
                }
            case 'head':
                {
                    this.contentEditor.insert(`### `)
                    this.moveContentEditorCursor(0, 0)
                    return
                }
        }

    }
    render() {
        const editor = this.props.editor
        const menu = this.props.menu
        return (
            <div className="editor-wrap">
                <Header title={editor.get('title')} tags={editor.get('tags').toJS()} edit={this.state.configMode} onClick={() => this.switchConfigMode()} />
                <ul id="editor-toolbar" className={classNames({hide: !this.state.toolbar.show, select: this.state.toolbar.selectMode})}>
                    <li className="show"><i className={classNames('fa', {'fa-plus': !this.state.toolbar.selectMode}, {'fa-align-right': this.state.toolbar.selectMode})}></i></li>
                    {
                        !this.state.toolbar.selectMode ?
                        [<li className="action image">
                            <input type="file" accept="image/*" onChange={this.onFileSelect.bind(this)}/>
                            <i className="fa fa-picture-o"></i>
                            <i className="fa fa-refresh fa-spin hide"></i>
                        </li>,
                        <li type="code" className="action" onClick={this.onActionClick.bind(this)}><i className="fa fa-code"></i></li>,
                        <div className="extend">
                            <li type="line" className="action" onClick={this.onActionClick.bind(this)}><i className="fa fa-ellipsis-h"></i></li>
                            <li type="indent" className="action subaction" onClick={this.onActionClick.bind(this)}><i className="fa fa-indent"></i></li>
                            <li type="ol" className="action subaction" onClick={this.onActionClick.bind(this)}><i className="fa fa-list-ol"></i></li>
                            <li type="ul" className="action subaction" onClick={this.onActionClick.bind(this)}><i className="fa fa-list-ul"></i></li>
                            <li type="head" className="action subaction" onClick={this.onActionClick.bind(this)}><i className="fa fa-text-height"></i></li>
                        </div>] :
                        [<li type="bold" className="action" onClick={this.onActionClick.bind(this)}><i className="fa fa-bold"></i></li>,
                        <li type="italic" className="action" onClick={this.onActionClick.bind(this)}><i className="fa fa-italic"></i></li>,
                        <li type="link" className="action" onClick={this.onActionClick.bind(this)}><i className="fa fa-link"></i></li>
                        ]
                    }
                </ul>
                <div className={classNames('editor-wrap content-editor-wrap', {hide: this.state.configMode, 'focus-mode': menu.get('focusMode')})}><div id="content-editor"></div></div>
                <div className={classNames('editor-wrap config-editor-wrap', {hide: !this.state.configMode})}><div id="config-editor"></div></div>
            </div>
        )
    }
}

export default connect(function(state) {
    return {
        editor: state.editor,
        menu: state.menu
    }
}, function(dispatch) {
    return {
        listAction: bindActionCreators(listAction, dispatch),
        editorAction: bindActionCreators(editorAction, dispatch),
        menuAction: bindActionCreators(menuAction, dispatch),
        util: bindActionCreators(util, dispatch)
    }
})(Editor)

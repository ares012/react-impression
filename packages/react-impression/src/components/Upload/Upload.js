import classnames from 'classnames'
import React from 'react'
import PropTypes from 'prop-types'
import Icon from '../Icon'

export default class Upload extends React.PureComponent {
  static propTypes = {
    /**
     * 自定义样式
     */
    className: PropTypes.string,

    /**
     * 按钮文字
     */
    btnText: PropTypes.string,

    /**
     * 占位文字
     */
    placeholder: PropTypes.string,

    /**
     * 按钮样式
     */
    btnStyle: PropTypes.string,

    /**
     * 是否可预览
     */
    preview: PropTypes.bool,

    /**
     * 提示信息
     */
    message: PropTypes.string,

    /**
     * 文件路径
     */
    src: PropTypes.string,

    /**
     * 子组件
     */
    children: PropTypes.node,

    /**
     * 回调函数
     */
    onChange: PropTypes.func,
  }

  static defaultProps = {
    btnText: '浏览',
    btnStyle: 'default',
    placeholder: '请选择要上传的附件',
    preview: false,
  }

  constructor(props, context) {
    super(props, context)

    this.fileRef = element => {
      this.fileInput = element
    }
    this.state = {
      file: '',
    }
  }

  getValue() {
    return this.fileInput.files[0]
  }

  setValue(value) {
    this.fileInput.files[0] = value
  }

  /**
   * 打开文件浏览器对话框
   */
  openFileDialogHandle = () => {
    this.fileInput.click()
  }

  /**
   * 设置文件名
   */
  fileChangeHandle = event => {
    const { onChange } = this.props

    this.setState({
      file: event.target.files[0].name,
    })

    onChange && onChange(event)
  }

  /**
   * 图片预览处理
   */
  imagePreviewHandle = event => {
    const { onChange } = this.props
    const file = event.target.files[0]
    const reader = new window.FileReader()

    if (file) {
      reader.onload = e => {
        this.setState({
          previewImageUrl: e.currentTarget.result,
        })
      }
    }

    reader.readAsDataURL(file)
    onChange && onChange(event)
  }

  render() {
    const {
      preview,
      message,
      src,
      btnText,
      btnStyle,
      placeholder,
      className,
      onChange,
      ...others
    } = this.props
    const { file, previewImageUrl } = this.state
    let { children } = this.props

    if (preview) {
      if (children) {
        children = React.cloneElement(children, {
          className: classnames(
            'upload-preview-addon',
            children.props.className
          ),
        })
      }

      return (
        <div className='upload-preview' onClick={this.openFileDialogHandle}>
          <input
            type='file'
            ref={this.fileRef}
            onChange={onChange && this.imagePreviewHandle}
          />
          {previewImageUrl || src ? (
            <div className='upload-preview-inner upload-preview-img'>
              <img src={previewImageUrl || src} />
              <div className='upload-preview-remove'>
                <Icon type='trash' />
              </div>
            </div>
          ) : (
            <div className='upload-preview-inner upload-preview-tool'>
              {children || (
                <Icon type='camera' className='upload-preview-addon' />
              )}
              <span className='upload-preview-text'>{message}</span>
            </div>
          )}
        </div>
      )
    }

    return (
      <div
        {...others}
        className={classnames('input-group', 'input-group-upload', className)}
      >
        <span className='form-control'>
          <Icon type='upload' className='upload-addon' />
          {file || placeholder}
        </span>
        {/* 此处input只能放在中间，否则圆角样式会有问题 */}
        <input
          type='file'
          ref={this.fileRef}
          onChange={onChange && this.fileChangeHandle}
        />
        <span className='input-group-btn'>
          <button
            type='button'
            className={classnames('btn', `btn-${btnStyle}`)}
            onClick={this.openFileDialogHandle}
          >
            {btnText}
          </button>
        </span>
      </div>
    )
  }
}

Upload.getValue = ref => {
  if (!ref) return undefined

  return ref.getValue()
}

Upload.setValue = (ref, value) => {
  if (!ref) return

  ref.setValue(value)
}

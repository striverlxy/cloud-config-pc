import React from 'react'
import { Upload, Modal } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import httpUtils from '../../utils/request'

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

export default class PicturesWall extends React.Component {
  state = {
    previewVisible: false,
    previewImage: '',
    previewTitle: '',
    fileList: [],
  };

  handleCancel = () => this.setState({ previewVisible: false });

  handlePreview = async file => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }

    this.setState({
      previewImage: file.url || file.preview,
      previewVisible: true,
      previewTitle: file.name || file.url.substring(file.url.lastIndexOf('/') + 1),
    });
  };

  handleChange = ({ fileList }) => {
    this.setState({ fileList })
    let pics = fileList
                .filter(file => file.response && file.response.code == '000000')
                .map(file => file.response.data.url)
    this.props.saveFileList(pics)
  };

  render() {
    const { previewVisible, previewImage, fileList, previewTitle } = this.state;
    const uploadButton = (
      <div>
        <PlusOutlined />
        <div className="ant-upload-text">上传</div>
      </div>
    );
    return (
      <div className="clearfix">
        <Upload
          action={`${httpUtils.API_HOST}/oss-service/oss/ali/upload`}
          listType="picture-card"
          fileList={fileList}
          data= {{
            bucketName: 'test-zmy'
          }}
          onPreview={this.handlePreview}
          onChange={this.handleChange}
        >
          {fileList.length >= this.props.maxCount ? null : uploadButton}
        </Upload>
        <Modal
          visible={previewVisible}
          title={previewTitle}
          footer={null}
          onCancel={this.handleCancel}
        >
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </div>
    );
  }
}
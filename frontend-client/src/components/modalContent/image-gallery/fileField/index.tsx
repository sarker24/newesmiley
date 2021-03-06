import * as React from 'react';
import { IconButton, LinearProgress } from '@material-ui/core';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import CloudOffIcon from '@material-ui/icons/CloudOff';
import InsertDriveFileIcon from '@material-ui/icons/InsertDriveFile';
import ClearIcon from '@material-ui/icons/Clear';
import { InjectedIntlProps, injectIntl } from 'react-intl';
import classNames from 'classnames';
import './index.scss';

export interface OwnProps {
  file?: Blob; // requires proper fix, seems this  can only be  blob that treated as file in the code
  accepts: string;
  cancelHandler: () => void;
  onFileReceived: (file: File) => void;
  progress: number;
  className?: string;
  limit?: number;
}

export interface IComponentState {
  isFileDraggedOver: boolean;
  isError: boolean;
}

type FileFieldProps = OwnProps & InjectedIntlProps;

class FileField extends React.Component<FileFieldProps, IComponentState> {
  fileInputRef: React.RefObject<HTMLInputElement> = null;
  divisionByte = 1000000;
  timeoutDuration = 2000;
  timeout: NodeJS.Timer = null;

  constructor(props: FileFieldProps) {
    super(props);

    this.state = {
      isFileDraggedOver: false,
      isError: false
    };

    this.fileInputRef = React.createRef();
  }

  componentWillUnmount() {
    clearTimeout(this.timeout);
  }

  onFormSubmit = (e: React.MouseEvent) => {
    e.preventDefault(); // Stop form submit
    if (!this.props.file) {
      return this.fileInputRef.current.click();
    }
    return;
  };

  onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    const { onFileReceived, limit } = this.props;

    if (limit && limit < files[0].size / this.divisionByte) {
      this.timeout = setTimeout(() => {
        this.setState({ isError: false });
      }, this.timeoutDuration);
      return this.setState({ isError: true });
    }
    return onFileReceived(files[0]);
  };

  onFileDrop = (e: React.DragEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();
    this.setState(Object.assign({}, this.state, { isFileDraggedOver: false }));

    if (e.dataTransfer.files.length > 0) {
      const fakeFileEvent = Object.assign({}, { target: { files: e.dataTransfer.files } });
      this.onChange(fakeFileEvent as React.ChangeEvent<HTMLInputElement>);
    }
  };

  clearHandler = () => {
    const { progress, cancelHandler, file } = this.props;

    if (progress >= 0 && file) {
      cancelHandler();
    }

    this.fileInputRef.current.value = '';
  };

  render() {
    const { intl, file, progress, accepts, className } = this.props;
    const { isError } = this.state;

    const formClass = classNames('fileForm', {
      draggedIn: this.state.isFileDraggedOver,
      'is-failed': isError,
      [className]: className.length > 0
    });

    const fileUploadPrompt = classNames('filePromptUpload');

    return (
      <form
        className={formClass}
        onDragEnter={() => {
          this.setState(Object.assign({}, this.state, { isFileDraggedOver: true }));
        }}
        onDragLeave={() => {
          this.setState(Object.assign({}, this.state, { isFileDraggedOver: false }));
        }}
        onDragOver={(e) => {
          e.preventDefault();
          this.setState(Object.assign({}, this.state, { isFileDraggedOver: true }));
        }}
        onDrag={this.onFileDrop}
        onDrop={this.onFileDrop}
        onClick={(e) => {
          if (!file) {
            this.fileInputRef.current.value = '';
            return this.fileInputRef.current.click();
          }
          return this.onFormSubmit(e);
        }}
      >
        <input
          className='fileInputRef'
          type='file'
          accept={accepts}
          onChange={this.onChange}
          ref={this.fileInputRef}
          defaultValue={(file as File) ? (file as File).name : ''}
        />
        {!file ? (
          <div className='filePrompt'>
            <div className={fileUploadPrompt}>
              {isError ? <CloudOffIcon className='cloud' /> : <CloudUploadIcon className='cloud' />}
              <p>
                {isError ? intl.messages['base.fileSizeLimit'] : intl.messages['base.selectFile']}
              </p>
            </div>
          </div>
        ) : (
          <div className='filePrompt'>
            <div className='filePromptData'>
              <InsertDriveFileIcon className='file' />
              <div className='filePromptDataMeta'>
                <p>
                  <span>{(file as File).name}</span>
                  <span>{Math.round(file.size / this.divisionByte).toFixed(2)}Mb</span>
                </p>
                {file && progress >= 1 ? (
                  <div className='filePromptDataMetaProgress'>
                    <LinearProgress variant='determinate' value={progress} />
                    <small>{`${Math.round(progress).toFixed(2)}% done`}</small>
                  </div>
                ) : null}
              </div>
            </div>
            <IconButton onClick={this.clearHandler}>
              <ClearIcon />
            </IconButton>
          </div>
        )}
      </form>
    );
  }
}

export default injectIntl(FileField);

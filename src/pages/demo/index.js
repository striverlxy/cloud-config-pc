import React, { useState } from 'react'
import {UnControlled as CodeMirror} from 'react-codemirror2'
import 'codemirror/lib/codemirror.js'
import 'codemirror/lib/codemirror.css';
// 主题风格
import 'codemirror/theme/material.css';
// 代码模式，clike是包含java,c++等模式的
import 'codemirror/mode/clike/clike';
//ctrl+空格代码提示补全
import 'codemirror/addon/hint/show-hint.css';
import 'codemirror/addon/hint/show-hint';
import 'codemirror/addon/hint/anyword-hint.js';
//代码高亮
import 'codemirror/addon/selection/active-line';
//折叠代码
import 'codemirror/addon/fold/foldgutter.css';
import 'codemirror/addon/fold/foldcode.js';
import 'codemirror/addon/fold/foldgutter.js';
import 'codemirror/addon/fold/brace-fold.js';
import 'codemirror/addon/fold/comment-fold.js';
import 'codemirror/addon/edit/closebrackets';

const Demo = () => {

    const [code, setCode] = useState('server:\n\tport: 8080')

    const onChange = (newValue, e) => {
        console.log(newValue)
        console.log(e)
    }

    const editorDidMount = () => {

    }

    const options = {
        selectOnLineNumbers: true
    };

    return (
        <div>
            <CodeMirror
                // value={data}
                options={{
                mode: {name:'text/x-yaml'},
                theme: 'material',
                autofocus:true,//自动获取焦点
                styleActiveLine:true,//光标代码高亮
                lineNumbers: true, //显示行号
                smartIndent:true,  //自动缩进
                //start-设置支持代码折叠
                lineWrapping:true,
                foldGutter:true,
                gutters:['CodeMirror-linenumbers','CodeMirror-foldgutter'],//end
                extraKeys:{
                    "Ctrl":"autocomplete",
                    "Ctrl-S": function (editor) {
                            // that.codeSave(editor)
                            },
                    "Ctrl-Z":function (editor) {
                            editor.undo();
                            },//undo
                    "F8":function (editor) {
                            editor.redo();
                            },//Redo
                        },
                    matchBrackets: true,  //括号匹配，光标旁边的括号都高亮显示
                    autoCloseBrackets: true //键入时将自动关闭()[]{}''""
                        }}
                        // onChange={this.codeOnChange}

                        // 在失去焦点的时候触发，这个时候放数据最好
                        // onBlur={this.codeOnBlur}

                    // // 这个必须加上，否则在一些情况下，第二次打开就会有问题
                    // //     onBeforeChange={(editor, data, value) => {
                    // //       console.log("onBeforeChange fresh")
                    // //       console.log(JSON.stringify(data));
                    // //     }}
                    //     /* HERE: pick out only the value. and might as well get name. */
            />
        </div>
    )
}

export default Demo
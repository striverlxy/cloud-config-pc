import React, { useState } from 'react'
import MonacoEditor, { MonacoDiffEditor } from 'react-monaco-editor';

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
            <MonacoEditor
                width="800"
                height="600"
                language="yaml"
                theme="vs-dark"
                value={code}
                options={options}
                onChange={onChange}
                editorDidMount={editorDidMount}
            />
        </div>
    )
}

export default Demo
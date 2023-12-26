import React, { useState } from 'react';
import * as path from "path";
const { ipcRenderer } = window.require('electron');

function App() {
    const [directoryPath, setDirectoryPath] = useState('');
    const [fileExtensions, setFileExtensions] = useState('.md'); // Comma-separated
    const [exportDirectory, setExportDirectory] = useState('');
    const [exportFileName, setExportFileName] = useState('My Tied Text');

    const selectDirectory = async () => {
        try {
            const path = await ipcRenderer.invoke('open-directory-dialog');
            if (path) {
                setDirectoryPath(path);
            }
        } catch (error) {
            console.error('Error selecting directory:', error);
        }
    };

    const selectExportDirectory = async () => {
        try {
            const path = await ipcRenderer.invoke('open-export-directory-dialog');
            if (path) {
                setExportDirectory(path);
            }
        } catch (error) {
            console.error('Error selecting export directory:', error);
        }
    };

    const buildFile = async () => {
        const extensionsArray = fileExtensions.split(',').map(ext => ext.trim());
        let fileName = exportFileName.endsWith('.txt') ? exportFileName : `${exportFileName}.txt`;
        const fullExportPath = path.join(exportDirectory, fileName);

        try {
            const result = await ipcRenderer.invoke('build-file', directoryPath, extensionsArray, fullExportPath);
            if (result.success) {
                alert('File successfully built at ' + fullExportPath);
            } else {
                alert('Error: ' + result.message);
            }
        } catch (error) {
            console.error('Error building file:', error);
        }
    };

    return (
        <div>
            <div className={'properties-container'}>
                <h3>Directory</h3>

                <input
                    type="text"
                    value={directoryPath}
                    onChange={(e) => setDirectoryPath(e.target.value)}
                    placeholder="Directory to search..."
                    disabled
                />
                <button onClick={selectDirectory} className={'button'}>📂</button>
            </div>

            <div className={'properties-container'}>
                <h3>Extensions</h3>

                <input
                    type="text"
                    value={fileExtensions}
                    onChange={(e) => setFileExtensions(e.target.value)}
                    placeholder="Extension(s) to combine..."
                />
            </div>

            <div className={'properties-container'}>
                <h3>Export Directory</h3>

                <input
                    type="text"
                    value={exportDirectory}
                    placeholder="Directory to export to..."
                    disabled
                />
                <button onClick={selectExportDirectory} className={'button'}>📂</button>
            </div>

            <div className={'export-container'}>
                <h3>Export</h3>

                <input
                    type="text"
                    value={exportFileName}
                    onChange={(e) => setExportFileName(e.target.value)}
                    placeholder="Export Name..."
                    style={{ paddingRight: '40px' }}
                />
                <button onClick={buildFile} className={'button'}>📤</button>
            </div>
        </div>
    );
}

export default App;

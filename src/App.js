import React, { useState } from 'react';
import * as path from "path";
const { ipcRenderer } = window.require('electron');

function App() {
    const [directoryPath, setDirectoryPath] = useState('');
    const [fileExtensions, setFileExtensions] = useState('.md'); // Comma-separated
    const [exportDirectory, setExportDirectory] = useState('');
    const [exportFileName, setExportFileName] = useState('Tie.txt');
    const [exportLocation, setExportLocation] = useState('');

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
                setExportLocation(path); // We only set the path here, not the filename
            }
        } catch (error) {
            console.error('Error selecting export directory:', error);
        }
    };

    const buildFile = async () => {
        const extensionsArray = fileExtensions.split(',').map(ext => ext.trim());
        const fullExportPath = path.join(exportDirectory, exportFileName);
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
            <div>

                <h3>Directory</h3>

                <input
                    type="text"
                    value={directoryPath}
                    onChange={(e) => setDirectoryPath(e.target.value)}
                    placeholder="Path to Directory..."
                    disabled
                />
                <button onClick={selectDirectory}>...</button>

            </div>

            <div>

                <h3>Extensions</h3>

                <input
                    type="text"
                    value={fileExtensions}
                    onChange={(e) => setFileExtensions(e.target.value)}
                    placeholder="Extensions..."
                />

                <p>The file extensions to combine. Comma seperated. Ex: .md, .cd</p>

            </div>

            <div>

                <input
                    type="text"
                    value={exportDirectory}
                    placeholder="Export Directory..."
                    disabled
                />
                <button onClick={selectExportDirectory}>...</button>

            </div>

            <div>

                <h3>Export Name</h3>

                <input
                    type="text"
                    value={exportFileName}
                    onChange={(e) => setExportFileName(e.target.value)}
                    placeholder="Export Name..."
                />

                <p>Set the name of the export file.</p>

            </div>

            <div>

                <button onClick={buildFile}>Export</button>

            </div>
        </div>
    );
}

export default App;

const { app, Menu, BrowserWindow, dialog } = require('electron')
const fs = require('fs')

let mainWindow = null
let currentFilePath = null

function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    autoHideMenuBar: false,
    resizable: true,
    maximizable: true,
    minimizable: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  })

  // Load the index.html of the app.
  mainWindow.loadFile('index.html')

  // Open the DevTools.
  mainWindow.webContents.openDevTools()

  // Set the menu
  const menu = Menu.buildFromTemplate(menuTemplate)
  Menu.setApplicationMenu(menu)
}

// Menu template
const menuTemplate = [
  {
    label: 'File',
    submenu: [
      {
        label: 'New File',
        accelerator: 'CmdOrCtrl+N',
        click: () => {
          mainWindow.webContents.send('new-file')
        }
      },
      {
        label: 'Open File',
        accelerator: 'CmdOrCtrl+O',
        click: () => {
          dialog.showOpenDialog(mainWindow, {
            properties: ['openFile'],
            filters: [
              { name: 'Text Files', extensions: ['txt'] },
              { name: 'Markdown Files', extensions: ['md', 'markdown'] }
            ]
          }).then((result) => {
            if (!result.canceled && result.filePaths.length > 0) {
              currentFilePath = result.filePaths[0]
              fs.readFile(currentFilePath, 'utf-8', (err, data) => {
                if (err) {
                  dialog.showErrorBox('Error', 'Failed to read the file')
                } else {
                  mainWindow.webContents.send('open-file', currentFilePath, data)
                }
              })
            }
          })
        }
      },
      {
        label: 'Open Folder',
        accelerator: 'CmdOrCtrl+Shift+O',
        click: () => {
          dialog.showOpenDialog(mainWindow, {
            properties: ['openDirectory']
          }).then((result) => {
            if (!result.canceled && result.filePaths.length > 0) {
              mainWindow.webContents.send('open-folder', result.filePaths[0])
            }
          })
        }
      },
      {
        label: 'Open Recent',
        submenu: [
          {
            label: 'File 1',
            click: () => {
              console.log('Open Recent File 1')
            }
          },
          {
            label: 'File 2',
            click: () => {
              console.log('Open Recent File 2')
            }
          }
        ]
      },
      {
        label: 'Reopen with Encoding',
        submenu: [
          {
            label: 'UTF-8',
            click: () => {
              console.log('Reopen with Encoding: UTF-8')
            }
          },
          {
            label: 'ISO-8859-1',
            click: () => {
              console.log('Reopen with Encoding: ISO-8859-1')
            }
          }
        ]
      },
      {
        type: 'separator'
      },
      {
        label: 'Save As',
        accelerator: 'CmdOrCtrl+Shift+S',
        click: () => {
          dialog.showSaveDialog(mainWindow, {
            defaultPath: currentFilePath || undefined,
            filters: [
              { name: 'Text Files', extensions: ['txt'] },
              { name: 'Markdown Files', extensions: ['md', 'markdown'] }
            ]
          }).then((result) => {
            if (!result.canceled &&               result.filePath.length > 0) {
              currentFilePath = result.filePath
              mainWindow.webContents.send('save-file-as', currentFilePath)
            }
          })
        }
      },
      {
        label: 'Save All',
        accelerator: 'CmdOrCtrl+Shift+A',
        click: () => {
          mainWindow.webContents.send('save-all')
        }
      },
      {
        type: 'separator'
      },
      {
        label: 'Print...',
        accelerator: 'CmdOrCtrl+P',
        click: () => {
          mainWindow.webContents.print()
        }
      },
      {
        type: 'separator'
      },
      {
        label: 'New Window',
        accelerator: 'CmdOrCtrl+Shift+N',
        click: () => {
          createWindow()
        }
      },
      {
        label: 'Close Window',
        accelerator: 'CmdOrCtrl+Shift+W',
        click: () => {
          mainWindow.close()
        }
      },
      {
        label: 'Close File',
        accelerator: 'CmdOrCtrl+W',
        click: () => {
          mainWindow.webContents.send('close-file')
        }
      },
      {
        label: 'Revert File',
        accelerator: 'CmdOrCtrl+Alt+Z',
        click: () => {
          console.log('Revert File')
        }
      },
      {
        label: 'Close All Files',
        accelerator: 'CmdOrCtrl+Shift+Q',
        click: () => {
          mainWindow.webContents.send('close-all-files')
        }
      },
      {
        type: 'separator'
      },
      {
        label: 'Exit',
        accelerator: 'CmdOrCtrl+Q',
        click: () => {
          app.quit()
        }
      }
    ]
  },
  {
    label: 'Edit',
    submenu: [
      {
        label: 'Undo',
        accelerator: 'CmdOrCtrl+Z',
        role: 'undo'
      },
      {
        label: 'Redo',
        accelerator: 'CmdOrCtrl+Shift+Z',
        role: 'redo'
      },
      {
        type: 'separator'
      },
      {
        label: 'Cut',
        accelerator: 'CmdOrCtrl+X',
        role: 'cut'
      },
      {
        label: 'Copy',
        accelerator: 'CmdOrCtrl+C',
        role: 'copy'
      },
      {
        label: 'Paste',
        accelerator: 'CmdOrCtrl+V',
        role: 'paste'
      },
      {
        label: 'Select All',
        accelerator: 'CmdOrCtrl+A',
        role: 'selectAll'
      }
    ]
  },
  {
    label: 'View',
    submenu: [
      {
        label: 'Reload',
        accelerator: 'CmdOrCtrl+R',
        click: () => {
          mainWindow.reload()
        }
      },
      {
        label: 'Toggle DevTools',
        accelerator: 'CmdOrCtrl+Shift+I',
        click: () => {
          mainWindow.webContents.toggleDevTools()
        }
      },
      {
        type: 'separator'
      },
      {
        label: 'Zoom In',
        accelerator: 'CmdOrCtrl+=',
        click: () => {
          mainWindow.webContents.zoomIn()
        }
      },
      {
        label: 'Zoom Out',
        accelerator: 'CmdOrCtrl+-',
        click: () => {
          mainWindow.webContents.zoomOut()
        }
      },
      {
        label: 'Reset Zoom',
        accelerator: 'CmdOrCtrl+0',
        click: () => {
          mainWindow.webContents.zoomReset()
        }
      }
    ]
  },
  {
    label: 'Help',
    submenu: [
      {
        label: 'About Luny Text',
        click: () => {
          const aboutWindow = new BrowserWindow({
            parent: mainWindow,
            modal: true,
            width: 400,
            height: 200,
            autoHideMenuBar: true,
            resizable: false,
            maximizable: false,
            minimizable: false,
            webPreferences: {
              nodeIntegration: true,
              contextIsolation: false
            }
          })

          aboutWindow.loadFile('about.html')
        }
      }
    ]
  }
]

app.whenReady().then(createWindow)

// Quit when all

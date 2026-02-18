// Modules to control application life and create native browser window
const electron = require('electron')
require.resolve('electron')
const {spawn} = require('child_process')
const {app, Menu} = require('electron')
const openAboutWindow = require('about-window').default;
const {BrowserWindow} = require('electron')
const path = require('path');
const os = require('os');


let lang = "en";
let helpWindow;
let productName = 'Edirom';

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

// "Help window" to display Edirom Manual
global.CreateHelp = function() {
	if(helpWindow !== undefined) {
		helpWindow.focus();
		return;
	}
	
	helpWindow = new BrowserWindow({width: 800, height: 600});
	
	helpWindow.loadFile('manual/manual_' + lang + '.html');
	
	helpWindow.on('closed', function() {
		helpWindow = undefined;
	});
}

// Language
global.SetLanguage = function(newLang) {
	if(lang != newLang) {
		lang = newLang;
		createMenu();
	}
}

// App entry page
global.LoadStartFile = function() {
	let startFile = 'entry/index_' + lang + '.html';
	mainWindow.loadFile(startFile)
}

// About window
function aboutWindow() {
	openAboutWindow({
		product_name: productName,
		icon_path: '../../icon.png',
		homepage: 'http://www.max-reger-institut.de',
		description: 'Bringing digital scholarly music editing to your desktop!',
		license: 'GPL-3.0-only',
		use_version_info: true,
		win_options: {
			width: 520,
			resizable: false,
			fullscreenable: false,
			fullscreen: false,
			maximizable: false,
			titleBarStyle: 'hidden',
			},
		bug_report_url: 'http:www.max-reger-institut.de',
		bug_link_text: 'Report a bug here!',
		open_devtools: true
	});
}

// Set label of first app menu entry depending on os
function getFirstMenuName() {
	if(os.platform() == "darwin") {
		return productName;
	} else {
		if(lang == "de") {
			return "Datei";
		} else {
			return "File";
		}
	}
}

// Menu template 'de'
const menuTemplateDE = [
	{
		label: getFirstMenuName(),
		submenu: [
			{
				label: 'Über ' + productName,
				click: aboutWindow
			},
			{label: 'Editionen neu laden', accelerator: 'CommandOrControl+R', click: global.LoadStartFile},
			{role: 'quit', label: 'Beenden'}
		]
	},
	{
		role: 'window',
		label: 'Fenster',
		submenu: [
			{ role: 'minimize', label: 'Fenster minimieren' },
// 			{ role: 'hide', label: 'Fenster ausblenden'},
			{ role: 'close', label: 'Fenster schließen' }
		],
	},
	{
// 		role: 'help',
		label: 'Hilfe',
		submenu: [
			{
				label: "Edirom Online Hilfe",
				click: global.CreateHelp
			},
			{label: "Developer Tools", click: function() {mainWindow.webContents.openDevTools()}}
		]
	}
];

// Menu template 'en'
const menuTemplateEN = [
	{
		label: getFirstMenuName(),
		submenu: [
			{label: 'About', click: aboutWindow},
			{label: 'Reload Editions', accelerator: 'CommandOrControl+R', click: global.LoadStartFile},
			{role: 'quit'/* , label: 'Beenden' */}
		]
	},
	{
		role: 'window',
// 		label: 'Fenster',
		submenu: [
			{ role: 'minimize'/* , label: 'Fenster minimieren'  */},
// 			{ role: 'hide'/* , label: 'Fenster ausblenden' */},
			{ role: 'close'/* , label: 'Fenster schließen'  */}
		],
	},
	{
// 		role: 'help',
		label: 'Help',
		submenu: [
			{
				label: "Edirom Online Help",
				click: global.CreateHelp
			},
			{label: "Developer Tools", click: function() {mainWindow.webContents.openDevTools()}}
		]
	}
];

// also change other language specific stuff
// when your App title should be translated
function createMenu() {
	let menu;
	
	if(lang == "de") {
		productName = "Edirom";
		menu = Menu.buildFromTemplate(menuTemplateDE);
	} else {
		productName = "Edirom";
		menu = Menu.buildFromTemplate(menuTemplateEN);
	}
	if(mainWindow !== undefined) {
		mainWindow.setTitle(productName);
	}
	Menu.setApplicationMenu(menu);
}

// start embedded jetty server
var server;

if(os.platform() == "darwin") {
	server = spawn('sh', [path.dirname(app.getAppPath()) + '/scripts/startServer.sh']);
} else if(os.platform() == "win32") {
	server = spawn('wscript', [path.dirname(app.getAppPath()) + '/scripts/startServer.vbs', "//B", "//Nologo"]);
}

// stop embedded jetty server
function shutdown () {
  if(os.platform() == "win32") {
	  
  	var winShutdown = spawn('wscript', [path.dirname(app.getAppPath()) + '/scripts/shutdownServer.vbs', "//B", "//Nologo"]);
  	
  	winShutdown.on('exit', function(code, signal) {
	  	app.quit();
  	});
  	
  } else {
	  
	  var macShutdown = spawn('sh', [path.dirname(app.getAppPath()) + '/scripts/shutdownServer.sh']);
	  
	  macShutdown.on('exit', function(code, signal) {  
	  	app.quit(); 
	  });
  }
}

// The main window!
function createWindow () {
	
	// set language
	if(app.getLocale().toLowerCase().includes("de")) {
		lang = "de";
	}
	
	// create app menu
	createMenu();
	
	// create the browser window = main window.
	mainWindow = new BrowserWindow({width: 1170, height: 700, title: productName, webPreferences: {nodeIntegration: true}})
	
	// load main window content
	global.LoadStartFile();
	
	// emitted when the window is closed.
	mainWindow.on('closed', function () {
	 shutdown();
	mainWindow = null
	});
	
	mainWindow.on('page-title-updated', function(event) {
	 event.preventDefault(); 
	});
}

// Server-Zeug
server.stderr.on('data', function(data) {
  console.log('stdout: ' + data);
});

server.on('error', (err) => {
  console.log("\n\t\tERROR: spawn failed! (" + err + ")");
});

server.on('exit', function (code, signal) {
  console.log('child process exited with ' +
              `code ${code} and signal ${signal}`);
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

/*
// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') app.quit()
})
*/

app.on('activate', function () {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

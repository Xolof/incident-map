/* global LocalFileSystem */

let fileModel = {
    file: null,
    result: {},

    createFile: function() {
        return new Promise (resolve => {
            window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function (fs) {
                console.log('file system open: ' + fs.name);
                fs.root.getFile(
                    "data.txt",
                    { create: true, exclusive: false },
                    function (fileEntry) {
                        fileModel.file = fileEntry;
                        resolve();
                    }, function() {
                        throw new Error("Error loading file");
                    });
            }, function() {
                throw new Error( "Error loading filesystem");
            });
        });
    },

    writeToFile: function(fileEntry, data, append) {
        return new Promise (resolve => {
            fileEntry.createWriter(function (fileWriter) {
                fileWriter.onwriteend = function() {
                    console.log("Successful file write...");
                    resolve();
                };

                fileWriter.onerror = function (e) {
                    console.log("Failed file write: " + e.toString());
                };

                if (append) {
                    try {
                        fileWriter.seek(fileWriter.length);
                    } catch (e) {
                        console.log("file doesn't exist!");
                    }
                }

                if (data) {
                    fileWriter.write(JSON.stringify(data));
                }
            });
        });
    },

    readFromFile: function(fileEntry) {
        return new Promise (resolve => {
            fileEntry.file(function (file) {
                var reader = new FileReader();

                reader.onloadend = function() {
                    fileModel.result = JSON.parse(this.result);
                    resolve();
                };

                reader.readAsText(file);
            }, function() {
                throw new Error( "Error reading from file");
            });
        });
    },

    deleteFile: function() {
        return new Promise (resolve => {
            window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function (fs) {
                console.log('file system open: ' + fs.name);
                fs.root.getFile("data.txt", { create: false }, function (fileEntry) {
                    fileEntry.remove(() => {
                        console.log("File removed");
                        resolve();
                    },
                    () => { console.log("Error deleting file"); });
                }, () => { console.log("Error opening file"); });
            }, () => { console.log("Error opening file system"); });
        });
    },

    writeToCache: async function(newData) {
        await fileModel.deleteFile();
        await fileModel.createFile();
        fileModel.writeToFile(fileModel.file, newData, true);
    }
};

module.exports = fileModel;

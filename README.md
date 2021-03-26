# google-drive-table-app
Table app for Google Drive integration

## Alias localhost
Since google doesn't like people running their API's on localhost (don't ask me why...), create an alias to localhost:

### For windows
1) Open a text editor in administrator mode
2) Open the hosts file "c:\Windows\System32\drivers\etc\hosts"
3) Add an alias to 127.0.0.1

### For linux/mac
1) Run the command "sudo nano /etc/hosts"
2) Add an alias to 127.0.0.1

## Create a settings file

In the root of the application, add a settings.json file:

```Typescript
{
    "devServer": {
        "port": "The port you want the development server to run on (this needs to be the PORT of the url  you've whitelisted in 'Create google drive credentials' step 6)",
        "host": "The HOST you want the development server to run on (see 'Alias localhost')",
        "ssl": false | true | { 
            "certPath": "Path to the SSL certificate in PEM format",
            "keyPath": "(optiona) path to the certificate key", 
            "caPath": "(optional) path to the root certificate in PEM format"
        }
    }
}
```

## Install node package manager
To run the code, you'll need a bunch of packages installed. The package manger we've chosen to use is node package manager (npm).
1) Install npm on your local machine.
2) Check that npm is installed properly by running "npm --version" (without quotes). If you're on a windows machine and already have a command console open before the installation, you need to open a new command console before npm becomes available.
3) Run "npm install" (without quotes). This will download all necessary packages into the node_modules folder.

## To actually run the code
If you've done all of the previous steps:

- Run "npm start" (without quotes) to run the application in development mode.
- Run "npm run-script build" (without quotes) to compile the application into the ./dist folder.
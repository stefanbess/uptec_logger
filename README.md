# uptec_logger

## Installation
```
npm i --save uptec_logger
```

## Usage

### Every following Function is also available in a async version

```
const UptecLogger = require('uptec_logger').DebugLogger;

const logger_settings = {
    active_priority: 5,
    priority_options: {
        "all_logs": 5,
        "request_logs": 4,
        "important_logs": 3,
        "error_logs": 2,
        "startup_logs": 1,
        "no_logs": 0
    }
};

const myLogger = new UptecLogger(logger_settings);

myLogger.log('Hello World','all_logs',config = {});
```

## Functions
### log()
```
let test_object = {
    title: "Text Generator",
    size: 160,
    msg: "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At v"
};

myLogger.log("Hello World", 5, {
    group: "Second Group",
    object: test_object
});
```
### fileLog()
```
let myLogger.fileLog("Hello World");
```
### getConfig()
```
let logger_config = myLogger.getConfig();
console.log(logger_config);
```
### getPriorityOptions()
```
let priority_options = myLogger.getPriorityOptions();
console.log(priority_options);
```
### getActivePriority()
```
let active_priority = myLogger.getActivePriority();
console.log(active_priority);
```
### getLoggerInitialized()
```
let logger_initialized = myLogger.getLoggerInitialized();
console.log(logger_initialized);
```
### getLogRotation()
```
let log_rotation = myLogger.getLogRotation();
console.log(log_rotation);
```
### getMaxFileSize()
```
let max_filesize = myLogger.getMaxFileSize();
console.log(max_filesize);
```

### startGroup() & endGroup()
```
myLogger.startGroup("First Group");
myLogger.log('Hello World');
myLogger.endGroup();
```

### initFileLog()
```
myLogger.initFileLog('Logfolder',config = {});
```
### EndFileLog()
```
myLogger.EndFileLog();
```
### setActivePriority()
```
myLogger.setActivePriority(2);

or 

myLogger.setActivePriority("error_logs");
```
### setLogRotation()
```
myLogger.setLogRotation(3);
```
### setMaxFileSize()
```
myLogger.setMaxFileSize(1024);
```
### setPriorityOptions()
```
myLogger.setPriorityOptions({
    "custom": 6,
    "complete_logs": 5,
    "include_incoming_requests": 4,
    "important_logs": 3,
    "error_logs": 2,
    "just_startup": 1,
    "no_logs": 0
});
```

## Changes
- Jan 08 2021 - Bugfixes / EndFileLog / FileLog Function is Public / AsyncSupport
- Jan 05 2021 - Bugfixes / Add README
- Jan 04 2021 - First Version / README to be continued
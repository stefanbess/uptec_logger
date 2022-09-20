const getCallerFile = require('get-caller-file');
const path = require("path");
const fs = require('fs');
const dayjs = require("dayjs")

function DebugLogger(config = {}) {

    //Private Class Parameters
    let active_priority = "complete"
    let priority_options = {
        "complete": 3,
        "important": 2,
        "error": 1,
        "none": 0
    }

    let logRotation = 5;
    let maxFileSize = 300000;
    let LoggerInitialized = false
    let folderPath = ""


    //private functions
    function sortOptions(options){
        let options_array = []
        Object.entries(options).forEach(option => {
            options_array.push([option["0"],option["1"]])
        })
    
        options_array.sort(function(a,b){
            if(a[1] < b[1]){return 1}
            if(a[1] > b[1]){return -1}
            if(a[1] == b[1]){return 0}
    
        })
    
        let sorted = {
    
        }
    
        options_array.forEach(option => {
            sorted[option[0]] = option[1]
        })
    
        return sorted
    }

    function execFileLog(input) {
        
        let files = fs.readdirSync(folderPath)
        let new_logname = folderPath+"/log_" + dayjs() + ".txt"
        if(files.length == 0){
            fs.appendFileSync(new_logname,input)
        }
        else{
            let used_file = ""
            let last_timestamp = new Date()
            let init = true
            files.forEach(file => {
                if(init){
                    used_file = file
                    last_timestamp = dayjs(file.replace("log_","").replace(".txt",""))
                    init = false
                }
                else{
                    let file_timestamp = file.replace("log_","").replace(".txt","")
                    if(dayjs(file_timestamp).isAfter(last_timestamp)){
                        used_file = file
                    }
                }
    
            })
            let path = `${folderPath}/${used_file}`
            let stats = fs.statSync(path)
            if(stats.size > maxFileSize){
                if(files.length == logRotation){
                    fs.unlinkSync(folderPath + files[0])
                }
                path = new_logname
            }
            fs.appendFileSync(path,input + ` - ${new Date().toLocaleString("en-US")}\n`)

        }
    }


    //public functions (snyc and async)
    this.fileLog = function(input){
        let success = true;
        let err = false;
        try {
            execFileLog(input)
        } catch (error) {
            success = false;
            err = error;
        }
        return{
            success: success,
            error: err
        }
    }

    this.fileLogAsync = function(input){
        let sync = this.fileLog(input)
        if(sync.success){
            return Promise.resolve(true)
        }
        else{
            return Promise.reject(sync.error)
        }
    } 

    this.initFileLog = function(folderpath,config = {}){
        let success = true;
        let err = false;
        try {   
            LoggerInitialized = true;
            folderPath = folderpath.toString()
            if(!(folderPath.startsWith("./") || folderPath.startsWith("/"))){
                folderPath = `./${folderPath}`
            }
            !fs.existsSync(folderPath) && fs.mkdirSync(folderPath);
            if("log_rotation" in config){
                this.setLogRotation(config.log_rotation);
            }
            if("max_filesize" in config){
                this.setMaxFileSize(config.max_filesize);
            }
        } catch (error) {
            success = false;
            err = error;
        }
        return {
            success: success,
            error: err
        }
    }

    this.InitFileLogAsync = function(folderpath,config = {}){
        let sync = this.initFileLog(folderpath,config)
        if(sync.success){
            return Promise.resolve(true)
        }
        else{
            return Promise.reject(sync.error)
        }
    } 

    this.endFileLog = function(){
        let success = true
        let err = false
        try {
            if(LoggerInitialized){
                LoggerInitialized = false
            }
            else{
                success = false
                err = new Error("File Logging is not initilazed and can therefore not be ended");
            }      
        } catch (error) {
            err = error
        }
        return {
            success : success,
            error: err
        }
    }

    this.endFileLogAsync = function(){
        let sync = this.endFileLog()
        if(sync.success){
            return Promise.resolve(true)
        }
        else{
            return Promise.reject(sync.error)
        }
    }

    this.setLogRotation = function(new_rotation){
        let success = false;
        let error = false;
        if (typeof new_rotation == "number" && new_rotation > 0){
            logRotation = new_rotation;
            success = true;
        }
        else{
            error = new Error("Invalid Input Type");
        };

        return {
            success: success,
            error: error
        };
    }

    this.setLogRotationAsync = function(new_rotation){
        let sync = this.setLogRotation(new_rotation)
        if(sync.success){
            return Promise.resolve(true)
        }
        else{
            return Promise.reject(sync.error)
        }
    }

    this.setMaxFileSize = function(new_filesize){
        let success = false;
        let error = false;
        if (typeof new_filesize == "number" && new_filesize > 0){
            maxFileSize = new_filesize;
            success = true;
        }
        else{
            error = new Error("Invalid Input Type");
        };

        return {
            success: success,
            error: error
        };
    }

    this.setMaxFileSizeAsync = function(new_filesize){
        let sync = this.setMaxFileSize(new_filesize)
        if(sync.success){
            return Promise.resolve(true)
        }
        else{
            return Promise.reject(sync.error)
        }
    }



    this.getPriorityOptions = function(){
        return priority_options
    }

    this.getPriorityOptionsAsync = function(){
        try {     
            let ret = this.getPriorityOptions()
            return Promise.resolve(ret)
        } catch (error) {
            return Promise.reject(error)
        }
    }


    this.getActivePriority = function(){
        return active_priority
    }

    this.getActivePriorityAsync = function(){
        try {     
            let ret = this.getActivePriority()
            return Promise.resolve(ret)
        } catch (error) {
            return Promise.reject(error)
        }
    }

    this.getLogRotation = function(){
        return logRotation
    }

    this.getLogRotationAsync = function(){
        try {     
            let ret = this.getLogRotation()
            return Promise.resolve(ret)
        } catch (error) {
            return Promise.reject(error)
        }
    }

    this.getMaxFileSize = function(){
        return maxFileSize
    }

    this.getMaxFileSizeAsync = function(){
        try {     
            let ret = this.getMaxFileSize()
            return Promise.resolve(ret)
        } catch (error) {
            return Promise.reject(error)
        }
    }

    this.isLoggerInitialized = function(){
        return LoggerInitialized
    }

    this.isLoggerInitializedAsync = function(){
        try {     
            let ret = this.isLoggerInitialized()
            return Promise.resolve(ret)
        } catch (error) {
            return Promise.reject(error)
        }
    }


    this.setPriorityOptions = function(new_prioritys,new_active= false){
        try {
            let valid = true;
            const prioritys = Object.entries(new_prioritys);
            prioritys.forEach(priority => {
                if(isNaN(priority["1"])){
                    valid = false;
                }
            })
            if(valid){
                priority_options = sortOptions(new_prioritys)
                if(new_active){

                    let active_set = this.setActivePriority(new_active)
                    if(!active_set.success){
                        this.setActivePriority(Object.keys(priority_options)[0])
                    }
                }
                else{
                    let entries = Object.entries(priority_options);
                    let strings = [];
                    entries.forEach(entry => {
                        strings.push(entry["0"])
                    });
                    let numbers = [];
                    entries.forEach(entry => {
                        numbers.push(entry["1"])
                    });

                    if(!(strings.includes(new_active)|| numbers.includes(new_active))){
                        this.setActivePriority(Object.keys(priority_options)[0])
                    }
                }
                return {
                    success: true,
                    error: false
                }
            }
            else{
                return {
                    success: false,
                    error: "Invalid Input Object"
                }
            }
            
        } catch (error) {
            return {
                success: false,
                error: error
            }
        }
    }

    this.setPriorityOptionsAsync = function(new_prioritys,new_active = false){
        let sync = this.setPriorityOptions(new_prioritys,new_active)
        if(sync.success){
            return Promise.resolve(true)
        }
        else{
            return Promise.reject(sync.error)
        }
    }


    this.setActivePriority = function (new_active){
        try {  
            if(typeof new_active == "string"){
                if(Object.keys(priority_options).includes(new_active)){
                    active_priority = new_active
                    return {
                        success: true,
                        error: false
                    }
                }
                else{
                    return {
                        success: false,
                        error: "Invalid Priority Input"
                    }
                }
            }
            else if (typeof new_active == "number"){
                let entry_array = Object.entries(priority_options);
                let entry = entry_array.filter(entry => {return entry["1"] == new_active})
                if(entry.length > 0){
                    active_priority = entry[0]["0"]
                    return {
                        success: true,
                        error: false
                    }
                }
                else{
                    return {
                        success: false,
                        error: "Priority in not included in options"
                    }
                }



            } 
            else{
                return {
                    success: false,
                    error: "Invalid Input"
                }
            }    
        } catch (error) {
            return {
                success: false,
                error: error
            }
        }
    }

    this.setActivePriorityAsync = function(new_active){
        let sync = this.setActivePriority(new_active)
        if(sync.success){
            return Promise.resolve(true)
        }
        else{
            return Promise.reject(sync.error)
        }
    }

    this.getConfig = function(){
        return {
            active_priority: active_priority,
            priority_options: priority_options,
            logRotation: logRotation,
            maxFileSize: maxFileSize,
            FileLoggerInitialized: LoggerInitialized
        }
    }

    this.getConfigAsync = function(){
        try {
            let ret = this.getConfig()
            return Promise.resolve(ret)
        } catch (error) {
            return Promise.reject(error)
        }
      
    }

    this.log = function (input,input_prio,options = {}) {
        let success = true;
        let err = false;
        try {
            if(LoggerInitialized){
                execFileLog(input)
            }
    
            let off = false
            if("off" in options){
                off = options.off
            }
    
            let env_priority = priority_options[active_priority];
            let input_priority;
    
            if(typeof input_prio == "string"){
                input_priority = priority_options[input_prio];
            }
            else if(typeof input_prio == "number"){
                input_priority = input_prio
            }
            else{
                input_priority = env_priority
            }
    
            if(!off && (input_priority <= env_priority)){
                const file_parts = getCallerFile().split(path.sep)
                const file = file_parts[file_parts.length-1]
                let line
                try {
                    line = /\((.*):(\d+):(\d+)\)$/.exec(new Error().stack.split("\n")[2])[2];
                } catch (error) {
                    line = "[unknown]"
                }


                let func_caller = "";

                if(this.log.hasOwnProperty("caller") && this.log.caller){
                    func_caller = this.log.caller.toString().replace("async ", "").split(" ")[1].split("(")[0]
                }
           
                if(func_caller == "" || func_caller == "=>"){func_caller = "[anonymous]"}
    
                let method = "log"
    
                if("type" in options){
                    method = options.type
                }
    
                let callerinfo = true
                if("callerinfo" in options){
                    callerinfo = options.callerinfo
                }
    
                if("group" in options){
                    console.group(options.group)
                }
    
    
                if("object" in options){
                    console[method](input,options.object)
                }
                else{
                    console[method](input)
                }
                if(callerinfo){
                    console[method](`-> in function ${func_caller} in file: ${file} at line: ${line} || ${new Date().toLocaleString("en-US")}`)
                }
                
                if("group" in options){
                    console.groupEnd()
                }
            }
            
        } 
        catch (error) {
            success = false
            err = error
        }
        return{
            success: success,
            error: err
        }
    };

    this.logAsync = function(input,input_prio,options = {}){
        let sync = this.log(input,input_prio,options)
        if(sync.success){
            return Promise.resolve(true)
        }
        else{
            return Promise.reject(sync.error)
        }
    }

    this.startGroup = function(name){
        console.group(name)
    }

    this.startGroupAsync = function(name){
        try {
            this.startGroup(name)
            return Promise.resolve(true)
        } catch (error) {
            return Promise.reject(error)
        }
    }

    this.endGroup = function(){
        console.groupEnd()
    }

    this.endGroupAsync = function(){
        try {
            this.endGroupAsync()
            return Promise.resolve(true)
        } catch (error) {
            return Promise.reject(error)
        }
    }

    //Constructing Object with given Config
    let new_prio = config.active_priority|| active_priority;
    if("priority_options" in config){
        this.setPriorityOptions(config.priority_options,new_prio);
    };
    if("log_rotation" in config){
        this.setLogRotation(config.log_rotation)
    };
    if("max_filesize" in config){
        this.setMaxFileSize(config.max_filesize)
    };
    if("filelog_path" in config){
        this.initFileLog(config.filelog_path);
    }
}

module.exports = {DebugLogger: DebugLogger}

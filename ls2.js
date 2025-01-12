const fs = require('fs').promises; 

async function listFiles() {   
    try {      
        var dir = '.';     
        if (process.argv[2]) dir = process.argv[2];
        console.log(process.argv)
        const files = await fs.readdir(dir);     
        for (const file of files) {       
            console.log(file);      
        }      
    } catch (err) {       
         console.error(err);     
    }    
} 

listFiles();


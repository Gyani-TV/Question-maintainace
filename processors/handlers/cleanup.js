module.exports = async (serverInstance)=>{
    const executeCleanup = () =>{
        return new Promise(async (resolve, reject) => {
            try{
                //try to stop the server here
                
            }catch(err) {
                reject(err);
            }
        })
    }
}
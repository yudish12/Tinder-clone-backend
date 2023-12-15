export const errHandler = (err,req,res,next)=>{
    console.log(err);
    
    err.statusCode = err.statusCode || 500; //checking weather statuscode is there if not assign 500
    err.status = err.status || 'error'; //if status not there just assign error

    if(err.code===11000){
      const dup_key = Object.keys(err.keyValue);
      return res.status(409).json({
        status:409,
        message:`${dup_key} with value ${err.keyValue[`${dup_key}`]} already exists`
      })
    }

    return res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });
}
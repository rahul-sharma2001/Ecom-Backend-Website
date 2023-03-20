const imageUpload = (req,res)=>{
    const files = req.files;
    const urls = [];
    files.forEach(element => {
        const arr = `http://localhost:${process.env.PORT}/${element.path.split('/').slice(1).join('/')}`;
        urls.push(arr);
    });
     res.json({urls : urls});
}

module.exports = imageUpload;
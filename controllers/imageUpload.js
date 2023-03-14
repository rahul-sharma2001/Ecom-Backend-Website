const imageUpload = (req,res)=>{
    const files = req.files;
    const urls = [];
    files.forEach(element => {
        const arr = `http://localhost:4000/${element.path.split('/').slice(1).join('/')}`;
        urls.push(arr);
    });
     res.json({urls : urls});
}

module.exports = imageUpload;
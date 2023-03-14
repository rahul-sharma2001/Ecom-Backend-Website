const imageUpload = (req,res)=>{
    console.log(req);
    const files = req.files;
    const urls = [];
    files.forEach(element => {
        const arr = `http://localhost:4000/${element.path.split('/').slice(1).join('/')}`;
        urls.push(arr);
        console.log(arr);
        console.log(urls);
    });
     res.json({urls : urls});
}

module.exports = imageUpload;
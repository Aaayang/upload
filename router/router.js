let formidable = require("formidable"),
    path = require("path"),
    fs = require("fs"),
    gm = require("gm"),
    imgName = "avatar.jpg";

// 首页
exports.index = function(req, res) {
    res.render("index", {
        imgName
    });
};

// 上传图像
exports.upload = function (req, res) {
    if (req.url == "/upload" && req.method.toLowerCase() == "post") {
        let form = new formidable.IncomingForm();
        // 制定上传路径
        form.uploadDir = path.join(__dirname, '/../upload');

        form.parse(req, function (err, fields, files) {
            let extName = path.extname(files.upload.name),
                oldFile = files.upload.path,
                newFile = path.join(__dirname, '/../upload/') + Math.random() + extName;

            imgName = path.basename(newFile);

            // 到这里说明上传成功了
            fs.rename(oldFile, newFile, function (err) {
                if (err) {
                    res.send({
                        ok: false,
                        msg: "上传成功但改名失败"
                    });
                    return;
                }

                gm(newFile)
                    .resize(580)// 等比变成宽度580
                    .crop(580, 580, 0, 0)// 保留高度580，使不溢出
                    .write(newFile, function (err) {
                        if (err) {
                            res.send({
                                ok: false,
                                msg: "写入失败"
                            });
                            return;
                        }
                        res.render("cutimage", {
                            imgName
                        });
                    });
            });
        });
    }
};

exports.handleCut = function (req, res) {
    let imgName = req.query.imgname,
        w = req.query.w,
        h = req.query.h,
        x = req.query.x,
        y = req.query.y,
        newFile = path.join(__dirname, '/../upload/') + imgName;
    gm(newFile)
        .crop(w, h, x, y)
        .resize(100, 100, "!")// "!"表示强制缩放成目标大小
        .write(newFile, function (err) {
            if (err) {
                res.send({
                    ok: false,
                    msg: "写入失败"
                });
                return;
            }
            res.send({
                ok: true,
                msg: "成功"
            });
        });
};
let express = require("express"),
    app = express(),
    path = require("path"),
    router = require("./router/router");

// 设置模板引擎，并将模板的后缀改为.html
app.set("views", path.join(__dirname, 'views'));
app.engine(".html", require("ejs").__express);
app.set("view engine", "html");

// 使用中间件，指定根目录是public
app.use(express.static("public"));
// 指定根目录，方便使用上传的图片
app.use("/upload", express.static("upload"));

// 首页
app.get("/", router.index);

// 上传成功后裁剪页面
app.post("/upload", router.upload);

// 裁剪接口
app.get("/handleCut", router.handleCut);

let server = app.listen(4000, function () {
    console.log("running localhost:4000...");
});


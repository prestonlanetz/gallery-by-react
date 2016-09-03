require('normalize.css/normalize.css');
require('styles/App.css');

import React from 'react';

// 将json数据打包，并返回给imageDatas
let imageDatas=require('../data/imagedatas.json');
// 数组存放图片打包后的地址
var imegeURL=[];
((imgArr)=>{
	for(let item of imgArr){
		// 根据图片的实际地址将图片打包，并将打包后的URL返回给singleImgURL
		let singleImgURL=require('../images/'+item.fileName);
		imegeURL.push(singleImgURL);
	}
})(imageDatas);

class AppComponent extends React.Component {
  render() {
    return (
    	<section className="stage">
    		<section className="img-sec">

    		</section>
    		<nav className="ctrl-nav">
    		</nav>
    	</section>
    );
  }
}

AppComponent.defaultProps = {
};

export default AppComponent;

require('normalize.css/normalize.css');
require('styles/App.css');
var ReactDOM = require('react-dom');

import React from 'react';

// 将json数据打包，并返回给imageDatas
let imageDatas=require('../data/imagedatas.json');
// 数组存放图片打包后的地址
// 为imageDatas添加打包后的URL数据
imageDatas=((imgArr)=>{
	for(let item of imgArr){
		// 根据图片的实际地址将图片打包，并将打包后的URL返回给singleImgURL
		let singleImgURL=require('../images/'+item.fileName);
		item.url=singleImgURL;
	}
	return imgArr;
})(imageDatas);


/*
 *	在一个范围区间内产生随机数的函数
 */
var  getRangeRandom=(min,max)=> Math.floor(Math.random() * (max-min)+min);

/*
 *	在一个30旋转范围内产生随即角度的函数
 */
var  get30DegRandom=()=>{
	return (Math.random() > 0.5 ? '' :'-') + Math.floor(Math.random()*30);
};

//定义单个海报组件，数组从父亲获得
const ImgFigure = React.createClass({
	handClick(){
		this.props.clickFunction(this.props.num)
	},
	render(){
		var styleObj={};
		//如果有位置信息，则付给style对象
		if(this.props.arrange.pos){
			styleObj=this.props.arrange.pos;
		}
		//如果有rotate属性则设置
		if(this.props.arrange.rotate){
			(['Moz','ms','Webkit',' ']).forEach((value)=>{styleObj[value+'Transform']=('rotate('+this.props.arrange.rotate+'deg)')});
		}
		return (
			<figure className="img-figure" style={styleObj} onClick={this.handClick}> 
				<back className="back">
					<h2 className="img-title">{this.props.data.desc}</h2>
				</back>
				<front>
					<img src={this.props.data.url}/>
					<figcaption>
						<h2 className="img-title">{this.props.data.title}</h2>
					</figcaption>
				</front>


			</figure>
			
			
			
		);
	}
});


// 大管家，统领所有子组建的数据
const AppComponent = React.createClass({
	getInitialState(){
		return	{
		// 表示每张图片状态对象数组
			imgsArrangeArr:[
				//数组元素为对象，表示每张图片的位置、旋转角度等
				/*{
					pos:{
						left:'0',
						right:'0'
					},
					rotate:0,
					face:front
				}*/
			],
			centerIndex:0
		};
	},

	// 定义一个常量对象，表示图片分布范围初始值
 constant : {
		//中心区域的坐标范围
		centerPos:{
			left:0,
			top:0
		},
		// 水平方向取值范围
		hPosRange:{
			// 2元素数组，表示范围下上限
			leftSecX:[0,0],
			rightSecX:[0,0],
			y:[0,0]
		},
		// 垂直方向取值范围
		vPosRange:{
			x:[0,0],
			topY:[0,0]
		}
	},

	// 主要功能函数，定义所有图片的位置、旋转信息
	rearrange(centerIndex){
		// 指定分布在上侧区域图片的数目，0->1个
		var topImgNum = Math.floor(Math.random() * 2);
		// 标记被放在上侧区域第一张图片的index，连续的图片被放在上侧
		var  topImgSpliceIndex = 0;
		let  imgsArrangeArr = this.state.imgsArrangeArr;
		// 从图片信息数组中剪出第centerIndex张图片，返回该图片数组（长度为1），将其位置信息居中

		//！！！！！！选着并对中部图片居中定位,设置旋转角度！！！！！！！
		var imgsArrangeCenterArr = imgsArrangeArr.splice(centerIndex,1);
		imgsArrangeCenterArr[0].pos = this.constant.centerPos;
		
		//选择上部图片
		//去除中心图片后，在剩下的图片中产生一个表示index的随机数，从数组该index处取出上侧区域的图片数组
		topImgSpliceIndex = Math.round(Math.random() * imgsArrangeArr.length - topImgNum);
		var imgsArrangeTopArr = imgsArrangeArr.splice(topImgSpliceIndex,topImgNum);
		
		// ！！！！！！！对上侧图片进行定位！！！！！！！！！
		imgsArrangeTopArr.forEach((value)=>{
			// 在上侧区域内产生随机点，直接生成style对象数据
			value = {
				pos:{
					top: getRangeRandom(this.constant.vPosRange.topY[0],this.constant.vPosRange.topY[1]),
					left: getRangeRandom(this.constant.vPosRange.x[0],this.constant.vPosRange.x[1])
				},
				rotate:get30DegRandom()
			}
		}
		);

		//！！！！！！！对左右两侧图片定位，左右均分！！！！！！！
		for(let i = 0,j = imgsArrangeArr.length,k = j / 2;i < j;i ++){
			//左边部分分配位置
			if (i < k) {
				imgsArrangeArr[i] = {
					pos:{
						left: getRangeRandom(this.constant.hPosRange.leftSecX[0],this.constant.hPosRange.leftSecX[1]),
						top: getRangeRandom(this.constant.hPosRange.y[0],this.constant.hPosRange.y[1])
					},
					rotate:get30DegRandom()
				};
			}else if(i >= k){
				imgsArrangeArr[i] = {
					pos:{
						left: getRangeRandom(this.constant.hPosRange.rightSecX[0],this.constant.hPosRange.rightSecX[1]),
						top: getRangeRandom(this.constant.hPosRange.y[0],this.constant.hPosRange.y[1])
					},
					rotate:get30DegRandom()
				};
			}
		}

		//！！！！将数组全部整合起来！！！！！！
		//整合上部区域的图片
		if (imgsArrangeTopArr && imgsArrangeTopArr[0]) {
			imgsArrangeArr.splice(topImgSpliceIndex,0,imgsArrangeTopArr[0]);
		}
		//整合中间的图片
		imgsArrangeArr.splice(centerIndex,0,imgsArrangeCenterArr[0]);

		this.setState({
			imgsArrangeArr: imgsArrangeArr
		});

	},

	//分配点击事件
	clickFunction(value){
		if(value == this.state.centerIndex){
			this.state.imgsArrangeArr[value].face = 'back';
			this.forceUpdate();
		}
	},

	// 图片加载后,计算每张图片的位置范围
	componentDidMount(){
		
		//获取舞台DOM，进而获取其大小，方便动态在CSS中更改stage大小管理
		let stageDOM = ReactDOM.findDOMNode(this.refs.stage),
			stageW = stageDOM.scrollWidth,
			stageH = stageDOM.scrollHeight,
			halfStageW = Math.round(stageW / 2),
			halfStageH = Math.round(stageH / 2);
			
		// 获取海报的大小，方便动态管理，以后自需更改图片定义的CSS时，其他全部联
		let imgFigureDOM = ReactDOM.findDOMNode(this.refs.imgFigure0),
			imgW = imgFigureDOM.scrollWidth,
			imgH = imgFigureDOM.scrollHeight,
			halfImgW = Math.round(imgW / 2),
			halfImgH = Math.round(imgH / 2);

	// 计算图片分布范围constant并覆盖初始值
	
		// 计算中心图片坐标点
		this.constant.centerPos = {
			left:halfStageW - halfImgW,
			top:halfStageH - halfImgH
		};
		// alert(this.refs.imgFigure0);
		//计算水平方向坐标范围
		this.constant.hPosRange.leftSecX[0] = -halfImgW;
		this.constant.hPosRange.leftSecX[1] =  halfStageW - halfImgW * 3;
		this.constant.hPosRange.rightSecX[0] = halfStageW + halfImgW;
		this.constant.hPosRange.rightSecX[1] = stageW - halfImgW;
		this.constant.hPosRange.y[0] = -halfImgH;
		this.constant.hPosRange.y[1] = stageH - halfImgH;
		// 计算图片垂直区域范围
		this.constant.vPosRange.x[0] = halfStageW - imgW;
		this.constant.vPosRange.x[1] = halfStageW + halfImgW;
		this.constant.vPosRange.topY[0] = -halfImgH;
		this.constant.vPosRange.topY[1] = halfStageH - halfImgH * 3;

		//将指定图片居中显示，并为他们分配点击事件
		this.state.centerIndex = Math.ceil(Math.random()*imageDatas.length);
		this.rearrange(this.state.centerIndex);
		
	},
  render(){
  	// 定义数组存放生成的组件
  	let imgFigures=[],
  		ctrlUnits=[];
  	// 利用更改后的JSON数据条数，为已经定义好的组件复用、添加数据
  	imageDatas.forEach(function(value,index){
  		// 初始化状态对象
  		if(!this.state.imgsArrangeArr[index]){
  			this.state.imgsArrangeArr[index] = {
  					pos:{
  						left:0,
  						top:0
  					},
  					rotate:0
  			};
  		}
  		// 为每张图片添加索引（ref），方便以后定位每张图片
  		imgFigures.push(<ImgFigure key={index} data={value} num={index} ref={'imgFigure' + index} arrange={this.state.imgsArrangeArr[index]}
  			clickFunction={this.clickFunction}/>);
  		}.bind(this)
  	);

    return (
    	<section className="stage" ref="stage">
    		<section className="img-sec">
    			{imgFigures}
    		</section>
    		<nav className="ctrl-nav">
    		</nav>
    	</section>
    );
  }
})

AppComponent.defaultProps = {
};

export default AppComponent;

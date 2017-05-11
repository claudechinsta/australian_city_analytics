import React from 'react';

class InfoPanel extends React.Component {

	constructor(props){
		super(props);
		this.state = {
			imgH: 100,
			imgW: 100,
		}
		this.buttonEvent = this.buttonEvent.bind(this);
	}

	buttonEvent(){
		this.setState({
			imgH: this.state.imgH + 5, 
			imgW: this.state.imgW + 5
		});
		console.log(this.state.imgH);
	}

   	render() {
	   	var titleStyle = {
	   		h1:{
				fontSize: 30,
		   	  	color: '#004080',
		   	  	fontFamily: '\'Open sans\', sans-serif',
		   	  	textAlign: 'center',
		   	  	padding: 30
	   		},
	   		h1_2:{
	   			fontSize: 15,
		   	  	color: '#666666',
		   	  	fontFamily: '\'Raleway\', sans-serif',
		   	  	textAlign: 'center',
	   		},
	   		h2:{
				marginBottom: 20,
		   		fontSize: 20, 
		   		fontFamily: '\'Open Sans\', sans-serif',
		   		paddingLeft: 15,
		   		color: '#666666'
	   		},
	   		h3:{ 
	   			marginTop: 5,
	   			marginLeft: 15,
		   		fontSize: 17, 
		   		fontFamily: '\'Open Sans\', sans-serif',
		   		color: '#666666'
	   		}
	   	};

	   	var panelStyle = {
	   		//The global stylesheet of Info Panel
	   		backgroundColor: 'white',
	   		opacity: 0.9
	   	};

		return ( 
			<div style = {panelStyle}>
				<div style = {titleStyle.h1}>
					<h>{this.props.SiteName}</h>
					<div style= {titleStyle.h1_2}>Geographical Knowledge System</div>
				</div>
				<SectionBreak MT = {15}/>
				<div style={titleStyle.h2}>Main Color</div>
				<ColorBlock topColor = {{	colorPerc: [6, 2, 4, 5, 9, 2, 4, 3, 7, 5],
											colorType: ['#B98B42', '#4C77AE', '#6E502D', '#DDB359', '#605D59', '#E6CD8F', '#9E5F1A', '#A3917C', '#906E42', '#643913']}}/>
				<SectionBreak MT = {25}/>

				<div style={titleStyle.h2}>Materials</div>
				<Materials matList = 'Stone'/>
				<Materials matList = 'Glass'/>

				<SectionBreak MT = {25}/>
				<div style={titleStyle.h2}>Architecture Style</div>

				<Architecture archStlye='French Renaissance Architecture'/>

				<SectionBreak MT = {25}/>
				<div style={titleStyle.h2}>Representative images</div>

				<ImageFrame />

				<SectionBreak MT = {25}/>
				<div style={titleStyle.h2}>Images Clusters</div>

				<div style={titleStyle.h3}>Clusters 1</div>
				<ImageFrame />
				
			</div>
		);
   }
}


/*
Class Name:  SectionBreak
Description: This is class is created for breaking different sections with a empty 'div'
*/
class SectionBreak extends React.Component {
	constructor(props) {
	  super(props);
	
	  this.state = {
	  };
	}

	render(){
		return(
			<div style = {{ marginTop: this.props.MT, 
							marginBottom: this.props.MB, 
							height: 1,
							backgroundColor: '#B3B3B3',
							marginLeft: 'auto',
							marginRight: 'auto'}}>
			</div>
		);
	}
}



class ColorBlock extends React.Component {

	constructor(props) {
	  super(props);
	
	  this.state = {
	  	blockWidth: 280,
	  	blockHeight: 250,
	  	colorPerc: this.props.topColor.colorPerc,
	  	colorType: this.props.topColor.colorType,
	  	colorOpacity: 1,
	  	colorInfo: '',
	  	colorInfoText: '#B3B3B3',
	  	colorPercentage: 'Color Info'
	  };

	  this.mouseOnBar = this.mouseOnBar.bind(this);
	  this.mouseOffBar = this.mouseOffBar.bind(this);
	}



	mouseOnBar(value){
		var tempPerc = this.state.colorPerc;
		var tempType = this.state.colorType;
		tempPerc[value] = tempPerc[value] * 1.02;
		this.setState({ colorPerc: tempPerc, 
						colorInfo: 'Color: ' + tempType[value] + ' Percentage: ', 
						colorInfoText: tempType[value],
						colorPercentage: (tempPerc[value] / 1.02 + '%') });
	}

	mouseOffBar(value){
		var tempPerc = this.state.colorPerc;
		var tempType = this.state.colorType;
		tempPerc[value] = tempPerc[value] / 1.02;
		this.setState({colorPerc: tempPerc, colorInfo: tempType[value] + ' '});
	}

	getStyleList() {
		var tempList = [];

		for (var i = 0; i < this.state.colorPerc.length; i++){
			tempList[i] = {
				width: this.state.blockWidth / this.state.colorPerc.length,
				height: (this.state.blockHeight - 80) * this.state.colorPerc[i] / 10,
				backgroundColor: this.state.colorType[i],
				float: 'left',
				cursor: 'pointer'
			}
		}

		return tempList;
	}

	render() {

		var	colorPerc = this.props.topColor.colorPerc;
	  	var colorType = this.props.topColor.colorType;

		var backgroundStyle = {
			width: this.state.blockWidth,
			height: this.state.blockHeight,
			textAlign: 'center',
			fontSize: 10,
			marginLeft: 'auto',   
			marginRight: 'auto',

		}

		var colorInfoBar = {
			fontSize: 11,
			fontFamily: '\'Open Sans\', sans-serif',
			color: 'white',
			padding: 13,
			backgroundColor: this.state.colorInfoText
		}

		var barStyle = this.getStyleList();

		function hi(value){
			return 'value';
		}

		return (
			<div style = {backgroundStyle}>
				
				<div style={colorInfoBar}>
					{this.state.colorInfo}{' '}
					{this.state.colorPercentage}
				</div>
				<div style = {barStyle[0]} 
				 	 onMouseOver = {() => this.mouseOnBar(0)}
				 	 onMouseOut  = {() => this.mouseOffBar(0)}>
				</div>
				<div style = {barStyle[1]}
					 onMouseOver = {() => this.mouseOnBar(1)}
					 onMouseOut  = {() => this.mouseOffBar(1)}>
				</div>
				<div style = {barStyle[2]}
					 onMouseOver = {() => this.mouseOnBar(2)}
					 onMouseOut  = {() => this.mouseOffBar(2)}>
				</div>
				<div style = {barStyle[3]}
					 onMouseOver = {() => this.mouseOnBar(3)}
					 onMouseOut  = {() => this.mouseOffBar(3)}>
				</div>
				<div style = {barStyle[4]}
					 onMouseOver = {() => this.mouseOnBar(4)}
					 onMouseOut  = {() => this.mouseOffBar(4)}>
				</div>
				<div style = {barStyle[5]}
					 onMouseOver = {() => this.mouseOnBar(5)}
					 onMouseOut  = {() => this.mouseOffBar(5)}>
				</div>
				<div style = {barStyle[6]}
					 onMouseOver = {() => this.mouseOnBar(6)}
					 onMouseOut  = {() => this.mouseOffBar(6)}>
				</div>
				<div style = {barStyle[7]}
					 onMouseOver = {() => this.mouseOnBar(7)}
					 onMouseOut  = {() => this.mouseOffBar(7)}>
				</div>
				<div style = {barStyle[8]}
					 onMouseOver = {() => this.mouseOnBar(8)}
					 onMouseOut  = {() => this.mouseOffBar(8)}>
				</div>
				<div style = {barStyle[9]}
					 onMouseOver = {() => this.mouseOnBar(9)}
					 onMouseOut  = {() => this.mouseOffBar(9)}>
				</div>


			</div>
		);
	}
}

class Materials extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			color: 'black',
			matW: 50,
			matH: 50,
			barColor: ''
		};

		this.mouseOnMat = this.mouseOnMat.bind(this);
		this.mouseOffMat = this.mouseOffMat.bind(this);
	}

	mouseOnMat(){
		this.setState({color: '#0080FF', barColor: '#F6F6F6'})
	}

	mouseOffMat(){
		this.setState({color: 'black', barColor: ''})
	}

	render(){
		var tableStyle = {
			fontFamily: '\'Open Sans\', sans-serif',
			textAlign: 'center',
			fontSize: 17,
			color: this.state.color,
			marginLeft: 'auto',
			marginRight: 'auto',
		}

		return(
			<div style = {{backgroundColor: this.state.barColor}}>
				<table style = {tableStyle}>
					<tbody>
						<tr onMouseOver = {this.mouseOnMat} onMouseOut = {this.mouseOffMat} >
							<td width={'90px'} height={'70px'} style={{marginTop: 'auto', marginBottom: 'auto'}}>	
									   <img src = {"./img/" + this.props.matList + ".jpg"} 
										 height={this.state.matH} 
										 width={this.state.matW} />
							</td>

							<td width={'70px'}>
								<a href= {"http://www.google.com/#q=" + this.props.matList + " material"}
								   target="_blank" 
								   style={{color: this.state.color, textDecoration: 'none'}}
								   onMouseOver = {this.mouseOnMat}
								   onMouseOut = {this.mouseOffMat}>{this.props.matList}</a>
							</td>
						</tr>
					</tbody>
				</table>
			</div>
		);
	}
}

class Architecture extends React.Component{
	constructor(props) {
	  super(props);
	}


	render(){

		var titleStyle = {
			fontFamily: 'Raleway',
			fontSize: 28,
			paddingLeft: 15,
			color: '#6f7180',
			marginTop: 20,
			marginBottom: 20
		}

		return(
			<h1 style = {titleStyle}>
				{this.props.archStlye}
			</h1>
		);
	}
}

class ImageFrame extends React.Component { //Image frame to contain images
	constructor(props) {
		super(props);

		this.state = {
			imgH: 90,
			imgW: 90,
			buttonColor: 'black'
		};

		this._buttonEvent = this._buttonEvent.bind(this);	  	
		this._mouseOnBtn = this._mouseOnBtn.bind(this);	  	
		this._mouseOffBtn = this._mouseOffBtn.bind(this);	   	
	}

	_buttonEvent(scale){
			switch(scale){
			//Modify the size of each image
				case 0: {
  					this.setState({imgH: this.state.imgH - 15, imgW: this.state.imgW - 15});
					break;
				}
				case 1: {
					this.setState({imgH: this.state.imgH + 15, imgW: this.state.imgW + 15});
					break;
				}
				case 2: {
					this.setState({imgH: 40, imgW: 40});
					break;
				}
				case 3: {
					this.setState({imgH: 90, imgW: 90});
					break;
				}
				case 4: {
					this.setState({imgH: 290, imgW: 290});
					break;
				}
			}

			console.log(this.state.imgH)
	}

	_mouseOnBtn(){
		this.setState({buttonColor: '#004080'});
	}

	_mouseOffBtn(){
		this.setState({buttonColor: 'black'});
	}

	render() {

		var styleSheet = {
			__h:{
				marginLeft: 15,
				paddingBottom: 20,
				fontSize: 14,
		   	  	color: this.state.buttonColor,
		   	  	fontFamily: '\'Raleway\', sans-serif',
		   	  	cursor: 'pointer'
			},
			__buttonPanel:{
				marginTop: 5,
				marginBottom: 10
			}

		}

			return(
			<div>
				<div style = {styleSheet.__buttonPanel}>
					
					<a style={styleSheet.__h} type="button" onClick={() => this._buttonEvent(2)} onMouseOver={this._mouseOnBtn} onMouseOut={this._mouseOffBtn}>Small</a>
					<a style={styleSheet.__h} type="button" onClick={() => this._buttonEvent(3)} onMouseOver={this._mouseOnBtn} onMouseOut={this._mouseOffBtn}>Medium</a>
					<a style={styleSheet.__h} type="button" onClick={() => this._buttonEvent(4)} onMouseOver={this._mouseOnBtn} onMouseOut={this._mouseOffBtn}>Large</a>
					
				</div>
				<div style = {{marginLeft: 15, marginRight: 15}}>	
					<Images imgName = '0123' imgHeight = {this.state.imgH} imgWidth = {this.state.imgW}  />
					<Images imgName = '0050' imgHeight = {this.state.imgH} imgWidth = {this.state.imgW}  />
					<Images imgName = '0082' imgHeight = {this.state.imgH} imgWidth = {this.state.imgW}  />
					<Images imgName = '0255' imgHeight = {this.state.imgH} imgWidth = {this.state.imgW}  />
					<Images imgName = '0123' imgHeight = {this.state.imgH} imgWidth = {this.state.imgW}  />
					<Images imgName = '0050' imgHeight = {this.state.imgH} imgWidth = {this.state.imgW}  />
					<Images imgName = '0082' imgHeight = {this.state.imgH} imgWidth = {this.state.imgW}  />
					<Images imgName = '0255' imgHeight = {this.state.imgH} imgWidth = {this.state.imgW}  />
					<Images imgName = '0050' imgHeight = {this.state.imgH} imgWidth = {this.state.imgW}  />
					<Images imgName = '0082' imgHeight = {this.state.imgH} imgWidth = {this.state.imgW}  />
					<Images imgName = '0123' imgHeight = {this.state.imgH} imgWidth = {this.state.imgW}  />

					<ImagesFact imgList={[1,2,3]} />
				</div>
			</div>
		);
	}
}

class ImagesFact extends React.Component{
	constructor(props) {
		super(props);
	}

	render(){
		return(
			<div>IMAGE FACTORY HERE {this.props.imgList}</div>
		);
	}
}


/*
* Class Name:   Images
* Description:  Rendering single image
* */
class Images extends React.Component{
	constructor(props) {
	  super(props);
	
	  this.state = {
	  	imgW: this.props.imgWidth,
	  	imgH: this.props.imgHeight,
	  	boxShadow: '',
	  	flagOfClick: false,
	  };

	  this.mouseOnImg = this.mouseOnImg.bind(this);
	  this.mouseOffImg = this.mouseOffImg.bind(this);
	}

	mouseOnImg(){	
		this.setState({boxShadow: '0px 0px 20px 2px #B3B3B3'})
		// this.setState({imgW: this.state.imgW + 10, imgH: this.state.imgH + 10})

	}

	mouseOffImg(){
		this.setState({boxShadow: ''})
		// this.setState({imgW: this.state.imgW - 10, imgH: this.state.imgH - 10})

	}

	render(){
		var stylesheet = {

			__imgStyle: { width: this.state.imgW, 
					  	  height: this.state.imgH,
					  	  padding: 5,
					  	  boxShadow: this.state.boxShadow,
					  	  cursor: 'pointer',
					  	  zIndex: this.state.z_Index,
					}
		};

		return(
			<a onMouseOver = {this.mouseOnImg}
			   onMouseOut = {this.mouseOffImg}
			   > 
            	<img style={stylesheet.__imgStyle} 
            		 src={"./img/flinder_station/" + this.props.imgName + ".jpg"}/>
            </a>

		);
	}
}

export default InfoPanel;
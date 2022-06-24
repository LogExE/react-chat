
const React = require('react');
const ReactDOM = require('react-dom/client');

class Chat extends React.Component{
	constructor(props){
		super(props);
		this.socket = new WebSocket('ws://' + window.location.hostname + ':8080');
		this.state = {messages: []};
		this.socket.onopen = () => this.appendMessage({author: 'SYSTEM', text: 'Connected.'});
		this.socket.onmessage = (event) => {
			const message = JSON.parse(event.data);
			this.appendMessage(message);
		}
		this.socket.onclose = () => this.appendMessage({author: 'SYSTEM', text: 'Connection lost.'});
	}
	appendMessage(message){
		this.setState(prevState => ({messages: prevState.messages.concat([message])}));
	}
	componentWillUnmount(){
		this.socket.close();
	}
	render(){
		return (<div>
			{this.state.messages.map(({author, text}) => <Message author={author} text={text}/>)}
			<TextField send={(text) => this.socket.send(text)}/>
			</div>
		);
	}
}

function Message(props){
	return (<div>
		{props.author}: {props.text}
		</div>);
}

class TextField extends React.Component{
	constructor(props){
		super(props);
		this.state = {value: ''};
		this.send = props.send;
	}
	handleChange(event){
		this.setState({value: event.target.value});
	}
	handleSubmit(event){
		event.preventDefault();
		this.send(this.state.value);
		this.setState({value: ''});
	}
	render(){
		return (
			<form onSubmit={(event) => this.handleSubmit(event)}>
			<input type="text" value={this.state.value} onChange={(event) => this.handleChange(event)}/>
			<button>Send</button>
			</form>
		);
	}
}

function App(){
	return (
		<Chat/>
	)
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App/>);

var React = require('react-native');
window.navigator.userAgent = "react-native";

var io = require('socket.io-client/socket.io');

var {
  Component,
  AppRegistry,
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  TextInput,
  ListView,
  Alert
} = React;

class reactExpessClient extends Component {
  constructor(props){
    super(props);
    this.socket = io('http://192.168.50.51:3000', {jsonp: false});

    this.state = {
      newTodo: '',
      todoSource: new ListView.DataSource({rowHasChanged: (row1, row2) => row1 !== row2})
    };
    fetch("http://192.168.50.51:3000/api/task", {method: "GET"})
    .then((response) => response.json())
    .then((responseData) => {
      this.items = responseData;
      this.setState({
      todoSource: this.state.todoSource.cloneWithRows(this.items)
    });
    }).catch((error) => {console.warn(error)});
  }
  componentDidMount(){
    //Add
    this.socket.on('add', (dataReturn) => {
      this.items.push({_id: dataReturn._id, nameTask: dataReturn.nameTask});
      this.setState({
      todoSource: this.state.todoSource.cloneWithRows(this.items)
    });
    });
    //removeTodo
    this.socket.on('remove', (dataReturn) => {
      this.items = this.items.filter((x) => x._id !== dataReturn._id);
      this.setState({
        todoSource: this.state.todoSource.cloneWithRows(this.items)
      })
    });

  }
  _onPressButtonPOST(){
    if(this.state.newTodo !== ''){
      fetch("http://192.168.50.51:3000/api/task", {method: "POST", headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  }, body: JSON.stringify({nameTask: this.state.newTodo})})
      .then((response) => response.json())
      .then((responseData) => {
        Alert.alert("POST response", JSON.stringify(responseData.message));
        this.setState({ newTodo : '' });
      }).catch((error) => {console.warn(error);});
    }

  }
  removeTodo(rowData) {
    fetch("http://192.168.50.51:3000/api/task/"+rowData._id, {method: "DELETE"})
    .then((response) => response.json())
    .then((responseData) => {
      Alert.alert("DELETE response", JSON.stringify(responseData.message));
    })
    .catch((error) => {console.warn(error);});
  }
  render(){
    return (
    <View style={styles.appContainer}>
      <View style={styles.titleView}>
        <Text style={styles.titleText}>
          Thu Do Multimedia App
        </Text>
      </View>
      <View style={styles.inputcontainer}>
        <TextInput style={styles.input} onChangeText={(nameTask) => this.setState({newTodo: nameTask})} value={this.state.newTodo}/>
        <TouchableHighlight
          style={styles.button}
          onPress={() => this._onPressButtonPOST()}
          underlayColor='#dddddd'>
          <Text style={styles.btnText}>Add!</Text>
        </TouchableHighlight>
      </View>
      <ListView
        dataSource={this.state.todoSource}
        renderRow={this.renderRow.bind(this)} />
    </View>
  );
  }
  renderRow(rowData) {
    return (
      <TouchableHighlight
        underlayColor='#dddddd'
        onPress={() => this.removeTodo(rowData)}>
        <View>
          <View style={styles.row}>
            <Text style={styles.todoText}>{rowData.nameTask}</Text>
          </View>
          <View style={styles.separator} />
        </View>
      </TouchableHighlight>
    );
  }
}

var styles = StyleSheet.create({
  appContainer:{
    flex: 1
  },
  titleView:{
    backgroundColor: '#48afdb',
    paddingTop: 30,
    paddingBottom: 10,
    flexDirection: 'row'
  },
  titleText:{
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
    flex: 1,
    fontSize: 20,
  },
  inputcontainer: {
    marginTop: 5,
    padding: 10,
    flexDirection: 'row'
  },
  button: {
    height: 36,
    flex: 2,
    flexDirection: 'row',
    backgroundColor: '#48afdb',
    justifyContent: 'center',
    color: '#FFFFFF',
    borderRadius: 4,
  },
  btnText: {
    fontSize: 18,
    color: '#fff',
    marginTop: 6,
  },
  input: {
    height: 36,
    padding: 4,
    marginRight: 5,
    flex: 4,
    fontSize: 18,
    borderWidth: 1,
    borderColor: '#48afdb',
    borderRadius: 4,
    color: '#48BBEC'
  },
  row: {
    flexDirection: 'row',
    padding: 12,
    height: 44
  },
  separator: {
    height: 1,
    backgroundColor: '#CCCCCC',
  },
  todoText: {
    flex: 1,
  }
});
AppRegistry.registerComponent('reactExpessClient', () => reactExpessClient);

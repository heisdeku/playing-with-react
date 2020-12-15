const BasicInput = require('./BasicInput/basicInput') 

class App extends React.Component {
  render() {
    return (
      <div>
        <BasicInput />
      </div>
    )
  }    
}

ReactDOM.render(
  <App />,
  document.getElementById('root')
)

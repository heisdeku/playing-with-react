class BasicInput extends React.Component {
  constructor(props) {
    super(props);
    this.onFormSubmit.bind(this.onFormSubmit)
    this.onInputChange.bind(this.onInputChange)
    this.validate.bind(this.validate)
    this.state = {
      fields: {
        name: '',
        email: '',
        department: null,
        course: null
      },   
      people: [],
      fieldErrors: {},
      _loading: false,
      _saveStatus: 'READY'
    }
  }  
  componentDidMount() {
    const { loadPeople } = apiClient()
    this.setState({ _loading: true})
    loadPeople().then(people => {
      this.setState({ _loading: false, people: people})
    })
  }
  onFormSubmit(evt) {  
    evt.preventDefault()
    const { fields, people } = this.state;  
    if (this.validate()) return;   

    this.setState({ _saveStatus: 'SAVING'})
    const { savePeople }  = apiClient()
    const person = [...people, fields]
    savePeople(person).then(() => {
      this.setState({
        people: person,
        fields: {
          name: '',
          email: '',
          /*after the form is submitted we want to return them back to their default states */
          department: null,
          course: null   
        },
        _saveStatus: 'SUCCESS'           
      })      
    })    
    .catch((err) => {
      console.error(err)
      this.setState({ _saveStatus: 'ERROR' })
    })    
  }
  onInputChange({ name, value, error}) {
    const fields = this.state.fields;
    const fieldErrors = this.state.fieldErrors
    
    fields[name] = value;
    fieldErrors[name] = error;
    this.setState({ fields, fieldErrors, _saveStatus: 'READY' });
  }
  validate() {
    const person = this.state.fields;
    const fieldErrors = this.state.fieldErrors;
    const errMessages = Object.keys(fieldErrors).filter((k) => fieldErrors[k]);    

    if (!person.name) return true;
    if (!person.email) return true;
    if (!person.course) return true
    if (!person.department) return true;
    if (errMessages.length) return true;    
    

    return false;    
  }
  render() {
    const { fields, people, _loading, _saveStatus } = this.state;
    if (_loading) {
      return <p>Loading ...</p>
    }
    return (
      <div>
        <h1>Sign Up sheet </h1>
        <form onSubmit={this.onFormSubmit}>
          <FieldComponent
            placeholder='Name'
            name='name'
            value={fields.name}
            onChange={this.onInputChange}
            validate={(val) => (val ? false : 'Name Required')}
          />
          <FieldComponent
            placeholder='Email'
            name='email'
            type='email'
            value={fields.email}
            onChange={this.onInputChange}
            validate={(val) => (val ? false : 'Email Required')}
          />
          <br />
          <CourseSelect 
            department={fields.department}
            course={fields.course}
            onChange={this.onInputChange}
          />
          <br />
          {
            {
            SAVING: <input value="saving..." type='submit' disabled />,
            SUCCESS: <input value='Saved!' type='submit' disabled/>,
            ERROR: <input value='Save Failed - Retry?' type='submit' disabled={this.validate()} />,
            READY: <input value='submit' type='submit' disabled={this.validate()} />,            
            }[_saveStatus]
          }          
      </form>
        <h3>People</h3>
          <ul>
            { people.map(({name, email, department, course }, i) => <li key={i}>{[name, email, department, course].join('  - ')}</li>)}
          </ul>        
      </div>
      
    )
  }
}

class FieldComponent extends React.Component {
  constructor(props) {
    super(props)
    this.onChange.bind(this.onChange)
    this.state = {
      value: this.props.value,
      error: false
    }
  }  
  componentWillReceiveProps(update) {
    this.setState({ value: update.value });
  }
  onChange(evt) {
    const { name, validate } = this.props    
    const value = evt.target.value
    const error = validate ? validate(value) : false
    this.setState({ value, error })

    this.props.onChange({ name, value, error })
  }
  render() {
    return (
      <div>
        <input
          placeholder={this.props.placeholder}
          value = {this.state.value}
          onChange={this.onChange}
          type={this.props.type ? this.props.type : null}
        />
        <span style={{ color: 'red' }}>{this.state.error}</span>
      </div>
    )
  }
}


class CourseSelect extends React.Component {
  constructor(props) {
    super(props)
    
    this.state = {
      department: null,
      course: null,
      courses: [],
      _loading: false
    }
    this.fetch.bind(this.fetch)
    this.onSelectDepartment.bind(this.onSelectDepartment)
    this.onSelectCourse.bind(this.onSelectCourse)
    this.renderDepartmentSelect.bind(this.renderDepartmentSelect)
    this.renderCourseSelect.bind(this.renderCourseSelect)
  }  
  fetch(department) {
    this.setState({ _loading: true, courses: []})
    apiClient(department).then(courses => {
      this.setState({_loading: false, courses: courses})
    })
  }
  onSelectDepartment(evt) {
    const department = evt.target.value;
    const course = null;
    this.setState({ department, course})
    this.props.onChange({name: 'department', value: department})
    this.props.onChange({name: 'course', value: course})

    if (department) this.fetch(department)
  }
  onSelectCourse(evt) {
    const course = evt.target.value
    this.setState({ course })
    this.props.onChange({ name: 'course', value: course })
  }
  renderDepartmentSelect() {
    return (
      <select
        onChange={this.onSelectDepartment}
        value={this.state.department || ''}
      >
        <option value=''>
          Which Department?
        </option>
        <option value="core">
          NodeSchool:core
        </option>
        <option value="electives">
          NodeSchool:Electives
        </option>
      </select>
    )
  }
  renderCourseSelect() {
    if (this.state._loading) {
      return <p>Loading....</p>
    }
    if (!this.state.department || !this.state.courses.length) return <span />
    return (
      <select 
        onChange={this.onSelectCourse}
        value={this.state.course || ''}
      >
        {[
          <option value="" key="course-none">which course?</option>,
          ...this.state.courses.map((course, i) => (
            <option value={course} key={`course-${i}`}>{course}</option>
          ))
        ]}
      </select>
    )
  }
  render() {
    return (
      <div>
        { this.renderDepartmentSelect()}
        <br />
        { this.renderCourseSelect() }
      </div>
    )
  }
}

const Courses = {
  core: Core,
  electives: Electives,
}

function apiClient(department) {
  return {
    then(cb) {
      setTimeout(() => { cb(Courses[department]); }, 1000);
    },
  };
}



function apiClient() {
  let count = 1;

  const loadPeople = function () {
    return {
      then: function (cb) {
        setTimeout(() => {
          cb(JSON.parse(localStorage.people || '[]'))
        }, 1000)
      }
    }
  }
  const savePeople = function (people) {
    const success = !!(count++ % 2)

    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (!success) return reject({ success })

        localStorage.people = JSON.stringify(people)
        return resolve({ success })      
      }, 1000)
    })
  }
  return {
    count,
    loadPeople,
    savePeople
  }
}
ReactDOM.render(
  <BasicInput />,
  document.getElementById('root')
)
/*
export default BasicInput;*/
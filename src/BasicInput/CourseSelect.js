import React, { Component } from 'react';

import Core from './api/core.json'
import Electives from './api/electives.json'

import LoadingImage from './img/loading.gif'

const Courses ={
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

class CourseSelect extends Component {
  state = {
    department: null,
    course: null,
    courses: [],
    _loading: false
  }
  fetch = (department) => {
    this.setState({ _loading: true, courses: []})
    apiClient(department).then(courses => {
      this.setState({_loading: false, courses: courses})
    })
  }
  onSelectDepartment = (evt) => {
    const department = evt.target.value;
    const course = null;
    this.setState({ department, course})
    this.props.onChange({name: 'department', value: department})
    this.props.onChange({name: 'course', value: course})

    if (department) this.fetch(department)
  }
  onSelectCourse = (evt) => {
    const course = evt.target.value
    this.setState({ course })
    this.props.onChange({ name: 'course', value: course })
  }
  renderDepartmentSelect = () => {
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
  renderCourseSelect = () => {
    if (this.state._loading) {
      return <img alt="loading" src={LoadingImage} />
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

export default CourseSelect
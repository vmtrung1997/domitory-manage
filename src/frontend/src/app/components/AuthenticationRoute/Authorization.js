import React from 'react'
// Authorization HOC
export const Authorization = (allowedRoles) => (WrappedComponent, role) =>
{  return class WithAuthorization extends React.Component {
    constructor(props) {
      super(props)
    }
    render() {
      if (allowedRoles.includes(role)) {
        return <WrappedComponent {...this.props} />
      } else {
        return <h1>No page for you!</h1>
      }
    }
  }
}

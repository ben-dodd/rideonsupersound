// import React from 'react';

// // create the higher-order component
// const withLogging = (WrappedComponent) => {
//   // define the HOC
//   return class extends React.Component {
//     // define the context object that will be used for logging
//     static contextType = MyContext

//     // define the logging function
//     logAction = (action) => {
//       const { userId, currentTime } = this.context;
//       console.log(`[${currentTime}] User ${userId} performed action: ${action}`);
//     };

//     render() {
//       return (
//         // pass the logging function to the wrapped component as a prop
//         <WrappedComponent logAction={this.logAction} {...this.props} />
//       );
//     }
//   }
// };

// // use the higher-order component to wrap your app's components
// const MyComponent = (props) => {
//   const { logAction } = props;

//   // log a user action using the logging function provided by the HOC
//   logAction('clicked button');

//   return (...);
// };

// const MyWrappedComponent = withLogging(MyComponent);

export {}

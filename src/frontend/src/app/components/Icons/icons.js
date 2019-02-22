import React from 'react'
import 'font-awesome/css/font-awesome.min.css';
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSignOutAlt, faTrashAlt, faEdit, faPlus, faUsers, faBolt, faSkiingNordic, faUserGraduate, faFileInvoiceDollar } from '@fortawesome/free-solid-svg-icons'

library.add(faSignOutAlt, faTrashAlt, faEdit, faPlus, faUsers, faBolt, faSkiingNordic, faUserGraduate, faFileInvoiceDollar);

export default class Icons extends React.Component {
  render() {
    const { name, style } = this.props;
    return(
      <div>
        <FontAwesomeIcon icon={name} style={style} />
      </div>
    );
  }
}
import React from 'react'
import PropTypes from 'prop-types'
import Moment from 'react-moment'

const ProfileEducation = ({education}) => {
    const temp = education[0];
    return (
        <div>
            <h3 className="text-dark">{temp.school}</h3>
            <p>
                <Moment format = 'YYYY/MM/DD'>{temp.from}</Moment> - {!temp.to ? ' Now' : <Moment format = 'YYYY/MM/DD'>{temp.to}</Moment>}
            </p>
            <p>
                <strong>Degree: </strong> {temp.degree}
            </p>
            <p>
                <strong>Field Of Study: </strong> {temp.fieldofstudy}
            </p>
            <p>
                <strong>Description: </strong> {temp.description}
            </p>
        </div>
    )
}

ProfileEducation.propTypes = {
    education : PropTypes.array.isRequired,
}

export default ProfileEducation

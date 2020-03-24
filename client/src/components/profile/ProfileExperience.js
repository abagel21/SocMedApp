import React from 'react'
import PropTypes from 'prop-types'
import Moment from 'react-moment'

const ProfileExperience = ({experience }) => {
    console.log(experience)
    const temp = experience[0];
    {/*company, title, location, current, to, from, description*/}
    return (
        <div>
            <h3 className="text-dark">{temp.company}</h3>
            <p>
                <Moment format = 'YYYY/MM/DD'>{temp.from}</Moment> - {!temp.to ? ' Now' : <Moment format = 'YYYY/MM/DD'>{temp.to}</Moment>}
            </p>
            <p>
                <strong>Location: </strong> {temp.location}
            </p>
            <p>
                <strong>Position: </strong> {temp.title}
            </p>
            <p>
                <strong>Description: </strong> {temp.description}
            </p>
        </div>
    )
}

ProfileExperience.propTypes = {
    experience : PropTypes.array.isRequired,
}

export default ProfileExperience

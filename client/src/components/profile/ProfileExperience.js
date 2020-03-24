import React from 'react'
import PropTypes from 'prop-types'
import Moment from 'react-moment'

const ProfileExperience = ({experience }) => {
    console.log(experience)
    {/*company, title, location, current, to, from, description*/}
    return (
        <div>
            <h3 className="text-dark">{experience.company}</h3>
            <p>
                <Moment format = 'YYYY/MM/DD'>{experience.from}</Moment> - {!experience.to ? ' Now' : <Moment format = 'YYYY/MM/DD'>{experience.to}</Moment>}
            </p>
            <p>
                <strong>Location: </strong> {experience.location}
            </p>
            <p>
                <strong>Position: </strong> {experience.title}
            </p>
            <p>
                <strong>Description: </strong> {experience.description}
            </p>
        </div>
    )
}

ProfileExperience.propTypes = {
    experience : PropTypes.array.isRequired,
}

export default ProfileExperience

import React from 'react'
import Heroic from './_components/heroic'
import MilestoneSection from './_components/milestone'
import AlumniSection from './_components/alumnis'  
// import Founders from './_components/founders'
// import BoardOfMembers from './_components/boardmembers'
import VisionCommitment from './_components/visioncommitment'
import Timeline from './_components/timeline'
import JoinSection from './_components/joinus'
const about_us = () => {
  return (
    <>
    <Heroic/>
    <MilestoneSection/>
    <AlumniSection/>
    {/* <Founders/> */}
    {/* <BoardOfMembers/> */}
    <VisionCommitment/>
    <Timeline/>
    <JoinSection/>
    </>
  )
}

export default about_us
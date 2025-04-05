import InterviewCard from '@/components/InterviewCard'
import { Button } from '@/components/ui/button'
import { getCurrentUser} from '@/lib/actions/auth.actions'
import { getInterviewsByUserId, getLatestInterviews } from '@/lib/actions/general.action'
import Link from 'next/link'
import React from 'react'
import AudioRobotWrapper from '@/components/AudioRobotWrapper'

const Page = async () => {
  const user = await getCurrentUser();
  const userId = user?.id || '';
  const [userInterviews, latestInterviews] = await Promise.all([
    getInterviewsByUserId(userId),
    getLatestInterviews({ userId }),
  ]);
  const hasPastInterviews = (userInterviews ?? []).length > 0;
  const hasUpcomingInterviews = (latestInterviews ?? []).length > 0;

  return (
    <>
      <section className="card-cta">
        <div className="flex flex-col gap-6 max-w-lg">
          <h2>Get Interview Ready with an Ai Interviewer</h2>
          <p className="text-lg">
            Practice on Real Interview Questions and Get Instant Feedback
          </p>
          <Button asChild className="btn-primary max-sm w-full">
            <Link href="/interview">Generate Personalized Interview Questions</Link>
          </Button>
        </div>
        <AudioRobotWrapper
          imageSrc="/robot.png"
          audioSrc={[
            "/audio.mp3",
            "/audio1.mp3",
            "/audio2.mp3",
          ]}
          width={400}
          height={400}
          alt="robo-dude"
          className="max-sm:hidden"
        />
      </section>
      <section className="flex flex-col gap-6 mt-8">
        <section className="card-cta">
          <div className="flex flex-col gap-6 max-w-lg">
            <h2>Optimize Your CV with our trained AI model</h2>
            <p className="text-lg">
              Upload your resume for improved feedback
            </p>
            <Button asChild className="btn-primary max-sm w-full">
              <Link href="/cv">Generate Personalized Resumes</Link>
            </Button>
          </div>
          <AudioRobotWrapper
            imageSrc="/robot2.png"
            audioSrc={[
              "/audio.mp3",
              "/audio1.mp3",
              "/audio2.mp3"
            ]}
            width={400}
            height={400}
            alt="robo-dude"
            className="max-sm:hidden"
          />
        </section>
        <section className="flex flex-col gap-6 mt-8"></section>
        <h2>Your Interviews</h2>
        <div className="interviews-section">
          {hasPastInterviews ? (
            userInterviews?.map((interview) => (
              <InterviewCard {...interview} key={interview.id} />
            ))
          ) : (
            <p>You haven&apos;t taken any interviews yet</p>
          )}
        </div>
      </section>
    </>
  );
};

export default Page;
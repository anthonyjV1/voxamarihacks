import React from 'react';
import Link from 'next/link';
import InterviewCard from '@/components/InterviewCard';
import { Button } from '@/components/ui/button';
import { getCurrentUser } from '@/lib/actions/auth.actions';
import { getInterviewsByUserId, getLatestInterviews } from '@/lib/actions/general.action';
import AudioRobotWrapper from '@/components/AudioRobotWrapper';
import SimpleBackground from '@/components/ParticleBackground';

export default async function Page() {
  const user = await getCurrentUser();
  const userId = user?.id || '';
  const [userInterviews, ] = await Promise.all([
    getInterviewsByUserId(userId),
    getLatestInterviews({ userId }),
  ]);
  
  const hasPastInterviews = (userInterviews ?? []).length > 0;

  return (
    <>
      <SimpleBackground />
      
      <div className="container mx-auto px-4 py-8">
        <section className="card-cta bg-gray-800/60 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-gray-700">
          <div className="flex flex-col gap-6 max-w-lg">
            <h2 className="text-2xl md:text-3xl font-bold text-white">
              Get Interview Ready With An Ai Interviewer
            </h2>
            <p className="text-lg text-gray-300">
              Practice On Real Interview Questions And Get Instant Feedback
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

        <section className="card-cta bg-gray-800/60 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-gray-700 mt-8">
          <div className="flex flex-col gap-6 max-w-lg">
            <h2 className="text-2xl md:text-3xl font-bold text-white">
              Optimize Your CV With Our Trained AI model
            </h2>
            <p className="text-lg text-gray-300">
              Upload Your Resume For Improved Feedback
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

        <section className="mt-16">
          <h2 className="text-2xl font-bold text-white mb-6">Your Interviews</h2>
          
          {hasPastInterviews ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {userInterviews?.map((interview) => (
                <div key={interview.id} className="bg-gray-800/60 backdrop-blur-sm rounded-xl border border-gray-700 overflow-hidden">
                  <div className="p-4">
                    <InterviewCard {...interview} />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400 bg-gray-800/40 backdrop-blur-sm p-4 rounded-lg border border-gray-700">
              You haven&apos;t taken any interviews yet
            </p>
          )}
        </section>
      </div>
    </>
  );
}
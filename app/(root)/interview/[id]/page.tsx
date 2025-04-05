import Agent from "@/components/Agent";
import DisplayTechIcons from "@/components/DisplayTechIcons";
import { getCurrentUser } from "@/lib/actions/auth.actions";
import { getInterviewById } from "@/lib/actions/general.action";
import { getRandomInterviewCover } from "@/lib/utils";
import { redirect } from "next/navigation";
import Image from "next/image";
import NeuralBackground from "@/components/NeuralBackground"; // Import the component

const page = async ({params}: RouteParams) => {
  const {id} = await params;
  const user = await getCurrentUser();
  const interview = await getInterviewById(id);
  if (!interview) redirect('/');
  
  return (
    <>
      {/* Add the NeuralBackground component */}
      <NeuralBackground />
      
      <div className="relative z-10"> {/* Add a wrapper with z-index to ensure content is above the background */}
        <div className="flex flex-row gap-4 justify-between">
          <div className="flex flex-row gap-4 items-center max-sm:flex-col">
            <div className="flex flex-row gap-4 items-center">
              <Image src={getRandomInterviewCover()} alt="cover image" width={40} height={40} className="rounded-full object-cover size-[40px]"/>
              <h3 className="capitalize mb-5">
                {interview.role} Interview
              </h3>
            </div>
            <div className="mb-5">
              <DisplayTechIcons techStack={interview.techstack} />
            </div>
          </div>
          <p className="bg-dark-200 px-4 py-2 rounded-lg h-fit capitalize">
            {interview.type}
          </p>
        </div>
        <Agent
          userName={user?.name || ""}
          userId={user?.id}
          interviewId={id}
          type="interview"
          questions={interview.questions}
        />
      </div>
    </>
  )
}

export default page
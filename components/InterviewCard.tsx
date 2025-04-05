import { getRandomInterviewCover } from "@/lib/utils";
import dayjs from "dayjs";
import Image from "next/image";
import { Button } from "./ui/button";
import Link from "next/link";
import DisplayTechIcons from "./DisplayTechIcons";
import { getFeedbackByInterviewId } from "@/lib/actions/general.action";

const InterviewCard = async ({ id, userId, role, type, techstack, createdAt }: InterviewCardProps) => {
    const feedback = userId && id
        ? await getFeedbackByInterviewId({ interviewId: id, userId })
        : null;
    const normalizedType = /mix/gi.test(type) ? "Mixed" : type;
    const formattedDate = dayjs(feedback?.createdAt || createdAt || Date.now()).format("DD/MM/YYYY");

    return (
        <div className="w-[300px] max-sm:w-full min-h-[380px] p-6 rounded-lg border border-gray-200 bg-gray-50 dark:bg-gray-800 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
            <div className="relative h-full flex flex-col gap-4">
                {/* Type Badge */}
                <div className="absolute top-0 right-0 px-3 py-1.5 rounded-bl-lg bg-blue-100 dark:bg-blue-900">
                    <p className="text-sm text-blue-800 dark:text-blue-200 font-medium">{normalizedType}</p>
                </div>

                {/* Header with Image and Role */}
                <div className="flex flex-col items-center pt-8 gap-3">
                    <div className="relative size-[90px]">
                        <Image
                            src={getRandomInterviewCover()}
                            alt="cover image"
                            fill
                            className="rounded-full object-cover border-2 border-white dark:border-gray-600 shadow"
                        />
                    </div>
                    <h3 className="text-xl font-semibold text-center capitalize text-gray-800 dark:text-white">
                        {role} Interview
                    </h3>
                </div>

                {/* Date and Score */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-2">
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                        <Image 
                            src="/calendar.svg" 
                            alt="calendar" 
                            width={16} 
                            height={16} 
                            className="dark:invert opacity-75" 
                        />
                        <p className="text-sm">{formattedDate}</p>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                        <Image 
                            src="/star.svg" 
                            alt="star" 
                            width={16} 
                            height={16} 
                            className="dark:invert opacity-75" 
                        />
                        <p className="text-sm">{feedback?.totalScore ?? "---"}/100</p>
                    </div>
                </div>

                {/* Feedback Text */}
                <div className="flex-1 flex items-center justify-center">
                    <p className="line-clamp-3 text-center text-sm text-gray-600 dark:text-gray-400 px-2">
                        {feedback?.finalAssessment || "You haven't taken the interview yet. Take it now to get feedback"}
                    </p>
                </div>

                {/* Tech Icons and Button */}
                <div className="mt-4 flex flex-col-reverse sm:flex-row justify-between items-center gap-4">
                    <DisplayTechIcons techStack={techstack} />
                    <Button 
                        asChild 
                        className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white transition-colors"
                    >
                        <Link href={feedback ? `/interview/${id}/feedback` : `/interview/${id}`}>
                            {feedback ? "View Feedback" : "Start Interview"}
                        </Link>
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default InterviewCard;
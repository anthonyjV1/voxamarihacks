import Agent from "@/components/Agent";
import NeuralBackground from "@/components/NeuralBackground";
import { getCurrentUser } from "@/lib/actions/auth.actions";

const Page = async () => {
  const user = await getCurrentUser();
  
  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Neural network background - position fixed to cover entire viewport */}
      <div className="fixed top-0 left-0 right-0 bottom-0">
        <NeuralBackground />
      </div>
      
      {/* Main content */}
      <div className="relative z-10">
        <h3 className="mb-5">Interview generation</h3>
        <Agent userName = {user?.name ?? ''} userId = {user?.id} type = "generate" />
      </div>
    </div>
  );
};

export default Page;

import EventsBentoGrid from "@/app/events/_components/eventsBentoGrid";

export function Events(){
    return(
        <div className="bg-black pb-20">
            <h1 className="text-white md:text-4xl text-2xl font-medium text-center pb-5">Our Events</h1>
            <EventsBentoGrid/>
        </div>
    )
}
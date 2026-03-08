import { Link } from "react-router-dom";

export default function Error(propsError: { propsError: any; }) {
    const error = propsError.propsError;
    return (
        <div className="w-full min-h-screen bg-background flex flex-col gap-8 items-center justify-center p-8">
            <div className="  flex flex-row  gap-1 justify-center items-center ">
                <div className="  flex flex-row  gap-2 justify-center items-center outline-none">
                    <img alt="logo" src="/assets/logo2.png" className="h-20 w-20" />
                </div>
            </div>



            <p>We apologize for this error</p>
            
            <div className="text-danger">
            <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 24 24"><path fill="currentColor" d="M12 16.462q.262 0 .439-.177q.176-.177.176-.439q0-.261-.177-.438T12 15.23t-.438.177t-.177.438t.177.439t.438.177m-.5-3.308h1v-6h-1zM12.003 21q-1.866 0-3.51-.708q-1.643-.709-2.859-1.924t-1.925-2.856T3 12.003t.709-3.51Q4.417 6.85 5.63 5.634t2.857-1.925T11.997 3t3.51.709q1.643.708 2.859 1.922t1.925 2.857t.709 3.509t-.708 3.51t-1.924 2.859t-2.856 1.925t-3.509.709" /></svg>
            </div>


            <p className="text-sm ">
                Please try refreshing the page, If the problem persists, please contact
                support
            </p>

            <p className="  text-xs">Error loading this Section!</p>

            <p className="text-xs text-gray-600">Details : {error}</p>

            <div className="flex flex-row gap-2">
                <Link
                    to="/support"
                    className=" bg-accent hover:bg-complementary px-10 py-4 rounded-full text-text group inline-flex text-sm"
                >
                    Contact support

                </Link>
            </div>
        </div>
    );
}

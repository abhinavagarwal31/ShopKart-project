import { useAuth } from "../context/AuthContext";

function Home() {
    const { customer } = useAuth();

    console.log(customer);

    return (
        <div>
            <h1>Home</h1>

            {customer && (
                <p>Welcome, {customer.fullName}</p>
            )}
        </div>
    );
}

export default Home;
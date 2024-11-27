import WishlistItems from "./wishlistItems";

const Wishlist = () => {
    return (
        <div className="pt-[40px] container">
            <div className="flex justify-between ">
                <h1 className="font-semibold text-3xl">Wishlist</h1>
            </div>
            <WishlistItems/>
        </div>
    );
};

export default Wishlist;

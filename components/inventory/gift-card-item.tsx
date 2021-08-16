import AddIcon from "@material-ui/icons/Add";

export default function GiftCardItem() {
  return (
    <div className="flex w-full">
      <div>
        <div>
          <img
            className="inventory-item-image"
            src={"/img/giftCard.png"}
            alt={"GiftCard"}
          />
        </div>
        <div className="ml-2">
          <div className="font-bold">GIFT CARD</div>
          <div>Click to create new gift card</div>
        </div>
      </div>
      <div className="self-center pl-1 pl-2">
        <button className="icon-button-large" onClick={null}>
          <AddIcon style={{ fontSize: "40px" }} />
        </button>
      </div>
    </div>
  );
}

import AddIcon from "@material-ui/icons/Add";

export default function MiscItem() {
  return (
    <div className="inventory-item">
      <div className="inventory-item-div">
        <div>
          <img
            className="inventory-item-image"
            src={"/img/default.png"}
            alt={"GiftCard"}
          />
        </div>
        <div className="ml-2">
          <div className="font-bold">MISC ITEM</div>
          <div>Click to add a miscellaneous item or payment.</div>
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

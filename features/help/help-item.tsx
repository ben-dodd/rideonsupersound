export default function HelpItem({ help }) {
  return (
    <div>
      <div className="text-4xl font-bold">{help?.title}</div>
      <div className="text-sm italic mb-4">Tagged under {help?.tags}</div>
      <div
        dangerouslySetInnerHTML={{
          __html:
            help?.body ||
            '<font color="red"><i>This help topic needs writing.</i></font>',
        }}
      />
    </div>
  );
}

import ResourceCard from './ResourceCard';

export default function ResourcesGrid({ 
  items, 
  onOpenFolder, 
  onRename, 
  onDelete, 
  onPreview,
  selectedItems,
  onSelectItem,
  selectionMode
}) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 mt-4">
      {items.map(item => (
        <ResourceCard 
          key={item.id}
          item={item}
          onOpen={() => item.type === 'FOLDER' && onOpenFolder(item)}
          onRename={() => onRename(item)}
          onDelete={() => onDelete(item)}
          onPreview={() => onPreview(item)}
          isSelected={selectedItems?.has(item.id)}
          onSelect={onSelectItem}
          selectionMode={selectionMode}
        />
      ))}
    </div>
  );
}
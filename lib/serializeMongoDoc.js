export function serializeMongoDoc(doc) {
  if (!doc || typeof doc !== 'object') return doc;

  const plain = {};

  for (const key in doc) {
    if (typeof doc[key] === 'object') {
      if (doc[key] instanceof Date) {
        plain[key] = doc[key].toISOString(); // Handle dates
      } else if (doc[key]?._bsontype === 'ObjectID' || doc[key]?._bsontype === 'ObjectId') {
        plain[key] = doc[key].toString(); // Handle ObjectId
      } else {
        plain[key] = serializeMongoDoc(doc[key]); // Recurse for nested objects
      }
    } else {
      plain[key] = doc[key];
    }
  }

  return plain;
}

export default function DnDNavigation() {
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="container mx-auto px-4 text-center">
        <p>
          &copy; {new Date().getFullYear()} Index D&D. Tous droits réservés.
        </p>
        <p className="mt-2 text-sm text-gray-400">
          Non affilié à Wizards of the Coast. D&D et Donjons & Dragons sont des
          marques déposées de Wizards of the Coast LLC.
        </p>
      </div>
    </footer>
  );
}

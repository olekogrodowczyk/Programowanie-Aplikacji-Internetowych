# pai2021

## Zadanie na podstawowy poziom zaliczenia

* dodatkowi aktorzy: projekty oraz umowy; GUI dla administratora (tworzenie i edycja projektów) oraz dla kierowników projektów (tworzenie związanych z projektem umów)

* projekt [ nazwa, kierownik (id_osoby) ]

* umowa [ id_wykonawcy, nazwa, id_projektu, data_rozpoczęcia, data_zakończenia, wynagrodzenie ]

### GUI dodatkowe

* logując się jako kierownik projektu, możemy "rozliczyć" każdą umowę, dodając pole 'commited':true

### Uwagi:

- sensownie było by użyć kolekcji Persons jako zbioru wykonawców umów oraz kolekcji Users jako zbioru kierowników + administrator
- propozycja menu nawigacyjnego: dla administratora Wykonawcy|Kierownicy|Projekty|Historia, dla kierowników Umowy (z możliwością wyboru projektu, którego dotyczą i edycji tychże)
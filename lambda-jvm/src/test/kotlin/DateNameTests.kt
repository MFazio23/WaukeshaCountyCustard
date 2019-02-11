import org.faziodev.wcc.getTextVersion
import org.junit.Assert.assertEquals
import org.junit.Test
import java.time.LocalDate

class DateNameTests {
    //Wednesday, April 10th, 2019
    private val baseDate = LocalDate.of(2019, 4, 10)

    @Test
    fun testToday() {
        assertEquals("Today", baseDate.getTextVersion(baseDate))
    }

    @Test
    fun testYesterday() {
        assertEquals("Yesterday", baseDate.minusDays(1).getTextVersion(baseDate))
    }

    @Test
    fun testTomorrow() {
        assertEquals("Tomorrow", baseDate.plusDays(1).getTextVersion(baseDate))
    }

    @Test
    fun testThisFriday() {
        assertEquals("This week Friday", baseDate.plusDays(2).getTextVersion(baseDate))
    }

    @Test
    fun testNextTuesday() {
        assertEquals("Next week Tuesday", baseDate.plusDays(6).getTextVersion(baseDate))
    }

    @Test
    fun testLastThursday() {
        assertEquals("Last week Thursday", baseDate.minusDays(6).getTextVersion(baseDate))
    }

    @Test
    fun testTwelveDaysFromNow() {
        assertEquals("On April 22nd", baseDate.plusDays(12).getTextVersion(baseDate))
    }

    @Test
    fun testTwoWeeksFromNow() {
        assertEquals("On April 24th", baseDate.plusWeeks(2).getTextVersion(baseDate))
    }

    @Test
    fun testOneMonthAndADay() {
        assertEquals("On May 11th", baseDate.plusMonths(1).plusDays(1).getTextVersion(baseDate))
    }

    @Test
    fun testOneMonthAndTwoDays() {
        assertEquals("On May 12th", baseDate.plusMonths(1).plusDays(2).getTextVersion(baseDate))
    }

    @Test
    fun testOneMonthAgo() {
        assertEquals("On March 10th", baseDate.minusMonths(1).getTextVersion(baseDate))
    }

    @Test
    fun testInTheFuture() {
        assertEquals("On June 23rd", LocalDate.of(2019, 6, 23).getTextVersion(baseDate))
    }
}